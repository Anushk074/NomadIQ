using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using AIService.Application.Abstractions;
using AIService.Application.Common;
using AIService.Application.Dtos;
using Microsoft.Extensions.Options;

namespace AIService.Infrastructure.Ai;

public class GeminiAIProvider : IAIProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    // Used specifically to parse the JSON *text* Gemini returns (as opposed to the outer
    // envelope) - AssistantReply/AssistantAction carry enums, which need string conversion.
    private static readonly JsonSerializerOptions ResponseJsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    // Gemini's structured-output schema (OpenAPI-subset) for the trip plan shape.
    // Kept as a parsed JsonDocument for the process lifetime - JsonElement is an
    // immutable, thread-safe struct, so it's safe to reuse across concurrent requests.
    private static readonly JsonDocument SchemaDocument = JsonDocument.Parse("""
        {
          "type": "OBJECT",
          "properties": {
            "destination": { "type": "STRING" },
            "durationDays": { "type": "INTEGER" },
            "estimatedBudget": { "type": "NUMBER" },
            "currency": { "type": "STRING" },
            "summary": { "type": "STRING" },
            "days": {
              "type": "ARRAY",
              "items": {
                "type": "OBJECT",
                "properties": {
                  "day": { "type": "INTEGER" },
                  "activities": {
                    "type": "ARRAY",
                    "items": {
                      "type": "OBJECT",
                      "properties": {
                        "name": { "type": "STRING" },
                        "description": { "type": "STRING" },
                        "estimatedCost": { "type": "NUMBER" }
                      },
                      "required": ["name"]
                    }
                  }
                },
                "required": ["day", "activities"]
              }
            },
            "recommendations": { "type": "ARRAY", "items": { "type": "STRING" } },
            "notes": { "type": "ARRAY", "items": { "type": "STRING" } }
          },
          "required": ["destination", "durationDays", "estimatedBudget", "currency", "summary", "days", "recommendations", "notes"]
        }
        """);

    private const string SystemPrompt =
        "You are a travel planning assistant for NomadIQ, an Indian travel-planning platform. " +
        "Generate a realistic, budget-aware, structured trip itinerary as JSON matching the provided " +
        "schema only - no markdown, no commentary outside the JSON. All costs are in Indian Rupees (INR) " +
        "unless stated otherwise. Never claim any booking, reservation, or price is confirmed or " +
        "guaranteed - present all costs as estimates. If information is uncertain, make reasonable, " +
        "clearly-labeled assumptions rather than inventing specific unverifiable details such as exact " +
        "hotel names or confirmation numbers.";

    private readonly HttpClient _httpClient;
    private readonly GeminiSettings _settings;

    public GeminiAIProvider(HttpClient httpClient, IOptions<GeminiSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }

    public async Task<TripPlanResponse> GenerateTripPlanAsync(TripPlanPromptContext context, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new AIProviderException(
                "Gemini API key is not configured. Set it via 'dotnet user-secrets set \"AI:Gemini:ApiKey\" \"<key>\"' in the AIService project.");
        }

        var requestBody = new
        {
            systemInstruction = new { parts = new[] { new { text = SystemPrompt } } },
            contents = new[] { new { role = "user", parts = new[] { new { text = BuildUserPrompt(context) } } } },
            generationConfig = new
            {
                temperature = 0.4,
                responseMimeType = "application/json",
                responseSchema = SchemaDocument.RootElement
            }
        };

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"v1beta/models/{_settings.Model}:generateContent")
        {
            Content = JsonContent.Create(requestBody, options: JsonOptions)
        };
        httpRequest.Headers.Add("x-goog-api-key", _settings.ApiKey);

        using var response = await _httpClient.SendAsync(httpRequest, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new AIProviderException($"Gemini API request failed with status {(int)response.StatusCode}: {errorBody}");
        }

        var payload = await response.Content.ReadFromJsonAsync<GeminiGenerateContentResponse>(JsonOptions, cancellationToken);
        var text = payload?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

        if (string.IsNullOrWhiteSpace(text))
        {
            throw new AIProviderException("Gemini returned an empty response.");
        }

        try
        {
            return JsonSerializer.Deserialize<TripPlanResponse>(text, ResponseJsonOptions)
                ?? throw new AIProviderException("Gemini returned a response that could not be parsed into a trip plan.");
        }
        catch (JsonException ex)
        {
            throw new AIProviderException("Gemini returned a response that was not valid JSON.", ex);
        }
    }

    private static readonly JsonDocument AssistantSchemaDocument = JsonDocument.Parse("""
        {
          "type": "OBJECT",
          "properties": {
            "reply": { "type": "STRING" },
            "action": {
              "type": "OBJECT",
              "properties": {
                "type": {
                  "type": "STRING",
                  "enum": ["None", "UpdateTripBudget", "UpdateTripStatus", "AddActivity", "UpdateActivity", "DeleteActivity"]
                },
                "dayNumber": { "type": "INTEGER" },
                "activityId": { "type": "STRING" },
                "budget": { "type": "NUMBER" },
                "status": { "type": "STRING", "enum": ["Planning", "Confirmed", "Completed", "Cancelled"] },
                "name": { "type": "STRING" },
                "description": { "type": "STRING" },
                "location": { "type": "STRING" },
                "estimatedCost": { "type": "NUMBER" },
                "startTime": { "type": "STRING" },
                "endTime": { "type": "STRING" }
              },
              "required": ["type"]
            }
          },
          "required": ["reply", "action"]
        }
        """);

    private const string AssistantSystemPrompt =
        "You are NomadIQ's travel assistant. You help a user discuss and adjust ONE specific existing " +
        "trip. You are given that trip's current data - destination, dates, budget, status, and its " +
        "full day-by-day itinerary with activities - as structured context. This is the only source of " +
        "truth about the trip's current state. Ground every answer in that data; never invent " +
        "activities, prices, days, or trip details that are not present in the supplied context. If the " +
        "user asks something the supplied data cannot answer (for example, real-time weather, or a " +
        "day/activity that does not exist in this trip), say plainly that the information is not " +
        "available rather than guessing. " +
        "You may propose at most one action per reply, chosen only from this fixed set: None, " +
        "UpdateTripBudget, UpdateTripStatus, AddActivity, UpdateActivity, DeleteActivity. Only reference " +
        "day numbers and activity ids that literally appear in the supplied trip data - never invent an " +
        "id. Use None whenever the user is only asking a question. " +
        "You cannot execute anything yourself - your action is only a request. A separate system " +
        "validates it and attempts to apply it, and only that system knows whether it actually " +
        "succeeded. Therefore phrase your reply as an intention (\"I'll reduce the cost of...\"), never " +
        "as a completed fact (\"I've reduced...\") - you must not claim a change happened. " +
        "All costs you mention or estimate must be described as estimates, never as confirmed or " +
        "guaranteed prices. Never claim to book, reserve, or confirm anything.";

    public async Task<AssistantReply> GenerateAssistantReplyAsync(AssistantPromptContext context, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
        {
            throw new AIProviderException(
                "Gemini API key is not configured. Set it via 'dotnet user-secrets set \"AI:Gemini:ApiKey\" \"<key>\"' in the AIService project.");
        }

        var requestBody = new
        {
            systemInstruction = new { parts = new[] { new { text = AssistantSystemPrompt } } },
            contents = new[] { new { role = "user", parts = new[] { new { text = BuildAssistantUserPrompt(context) } } } },
            generationConfig = new
            {
                temperature = 0.3,
                responseMimeType = "application/json",
                responseSchema = AssistantSchemaDocument.RootElement
            }
        };

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"v1beta/models/{_settings.Model}:generateContent")
        {
            Content = JsonContent.Create(requestBody, options: JsonOptions)
        };
        httpRequest.Headers.Add("x-goog-api-key", _settings.ApiKey);

        using var response = await _httpClient.SendAsync(httpRequest, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new AIProviderException($"Gemini API request failed with status {(int)response.StatusCode}: {errorBody}");
        }

        var payload = await response.Content.ReadFromJsonAsync<GeminiGenerateContentResponse>(JsonOptions, cancellationToken);
        var text = payload?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

        if (string.IsNullOrWhiteSpace(text))
        {
            throw new AIProviderException("Gemini returned an empty response.");
        }

        try
        {
            return JsonSerializer.Deserialize<AssistantReply>(text, ResponseJsonOptions)
                ?? throw new AIProviderException("Gemini returned a response that could not be parsed into an assistant reply.");
        }
        catch (JsonException ex)
        {
            throw new AIProviderException("Gemini returned a response that was not valid JSON.", ex);
        }
    }

    private static string BuildAssistantUserPrompt(AssistantPromptContext context)
    {
        var trip = context.Trip;
        var sb = new StringBuilder();

        sb.AppendLine("Current trip:");
        sb.AppendLine($"- Destination: {trip.Destination}");
        sb.AppendLine($"- Dates: {trip.StartDate:yyyy-MM-dd} to {trip.EndDate:yyyy-MM-dd}");
        sb.AppendLine($"- Budget: INR {trip.Budget:0.##}");
        sb.AppendLine($"- Status: {trip.Status}");

        if (context.Destination is { } destination)
        {
            sb.AppendLine(
                $"- Destination info: {destination.City}, {destination.Country} - {destination.Description} " +
                $"Typical cost: approximately INR {destination.AverageBudgetPerDay:0.##}/day.");
        }

        sb.AppendLine();
        sb.AppendLine(trip.Days.Count == 0 ? "This trip has no itinerary days yet." : "Itinerary:");

        foreach (var day in trip.Days)
        {
            var notesSuffix = string.IsNullOrWhiteSpace(day.Notes) ? "" : $" [{day.Notes}]";
            sb.AppendLine($"Day {day.DayNumber} ({day.Date:yyyy-MM-dd}) - {day.Title}{notesSuffix}");

            if (day.Activities.Count == 0)
            {
                sb.AppendLine("  (no activities yet)");
            }

            foreach (var activity in day.Activities)
            {
                var cost = activity.EstimatedCost is { } c ? $"~INR {c:0.##}" : "cost unknown";
                var time = activity.StartTime is { } st
                    ? $", {st:HH\\:mm}" + (activity.EndTime is { } et ? $"-{et:HH\\:mm}" : "")
                    : "";
                sb.AppendLine($"  - [id: {activity.Id}] {activity.Name} ({cost}{time})");
            }
        }

        if (context.History.Count > 0)
        {
            sb.AppendLine();
            sb.AppendLine("Recent conversation:");
            foreach (var turn in context.History)
            {
                sb.AppendLine($"{turn.Role}: {turn.Content}");
            }
        }

        sb.AppendLine();
        sb.AppendLine($"user: {context.UserMessage}");

        return sb.ToString();
    }

    private static string BuildUserPrompt(TripPlanPromptContext context)
    {
        var request = context.Request;
        var sb = new StringBuilder();

        sb.AppendLine("Plan a trip with the following requirements:");
        sb.AppendLine($"- Total budget: INR {request.Budget:0.##} for the entire trip");
        sb.AppendLine($"- Duration: {request.DurationDays} day(s)");
        sb.AppendLine($"- Travel style: {request.TravelStyle}");
        sb.AppendLine($"- Number of travelers: {request.NumberOfTravelers}");
        sb.AppendLine($"- Preferences: {(request.Preferences is { Length: > 0 } prefs ? string.Join(", ", prefs) : "none specified")}");
        sb.AppendLine($"- Travel start date: {(request.TravelStartDate is { } date ? date.ToString("yyyy-MM-dd") : "not specified")}");

        if (context.ResolvedDestination is { } destination)
        {
            sb.AppendLine();
            sb.AppendLine($"Destination: {destination.City}, {destination.Country}.");
            sb.AppendLine(destination.Description);
            sb.AppendLine($"Typical cost: approximately INR {destination.AverageBudgetPerDay:0.##} per day.");
            sb.AppendLine($"Known for: {string.Join(", ", destination.Tags)}.");
        }
        else if (!string.IsNullOrWhiteSpace(request.Destination))
        {
            sb.AppendLine();
            sb.AppendLine($"Requested destination: {request.Destination} (not in our curated catalog - use general knowledge, and treat all details as unverified assumptions).");
        }
        else
        {
            sb.AppendLine();
            sb.AppendLine("No specific destination was requested. Choose the destination that best fits the budget, duration, travel style, and preferences above.");
        }

        sb.AppendLine();
        sb.AppendLine($"Return exactly {request.DurationDays} entries in the \"days\" array, numbered 1 through {request.DurationDays} in order.");

        return sb.ToString();
    }

    private sealed record GeminiGenerateContentResponse(List<GeminiCandidate>? Candidates);
    private sealed record GeminiCandidate(GeminiContent? Content);
    private sealed record GeminiContent(List<GeminiPart>? Parts);
    private sealed record GeminiPart(string? Text);
}
