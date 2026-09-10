using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using AIService.Application.Abstractions;
using AIService.Application.Common;
using AIService.Application.Dtos;
using Microsoft.Extensions.Options;

namespace AIService.Infrastructure.Ai;

public class GeminiAIProvider : IAIProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

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
            return JsonSerializer.Deserialize<TripPlanResponse>(text, JsonOptions)
                ?? throw new AIProviderException("Gemini returned a response that could not be parsed into a trip plan.");
        }
        catch (JsonException ex)
        {
            throw new AIProviderException("Gemini returned a response that was not valid JSON.", ex);
        }
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
