using System.Net.Http.Json;
using System.Text.Json;
using AIService.Application.Abstractions;
using AIService.Application.Dtos;

namespace AIService.Infrastructure.Clients;

public class DiscoveryServiceClient : IDiscoveryServiceClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public DiscoveryServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ResolvedDestination?> FindDestinationByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var destinations = await _httpClient.GetFromJsonAsync<List<DestinationDto>>("api/destinations", JsonOptions, cancellationToken)
            ?? [];

        var match = destinations.FirstOrDefault(d =>
            string.Equals(d.City, name, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(d.Country, name, StringComparison.OrdinalIgnoreCase));

        return match is null ? null : ToResolvedDestination(match);
    }

    public async Task<ResolvedDestination?> GetTopRecommendationAsync(TripPlanRequest request, CancellationToken cancellationToken = default)
    {
        var payload = new
        {
            budget = request.Budget,
            durationDays = request.DurationDays,
            travelStyle = request.TravelStyle,
            preferences = request.Preferences,
            travelMonth = request.TravelStartDate?.Month
        };

        var response = await _httpClient.PostAsJsonAsync("api/destinations/recommendations", payload, JsonOptions, cancellationToken);
        response.EnsureSuccessStatusCode();

        var recommendations = await response.Content.ReadFromJsonAsync<List<RecommendedDestinationDto>>(JsonOptions, cancellationToken)
            ?? [];

        var top = recommendations.FirstOrDefault();

        return top is null ? null : ToResolvedDestination(top.Destination);
    }

    private static ResolvedDestination ToResolvedDestination(DestinationDto destination) => new(
        destination.City,
        destination.Country,
        destination.Description,
        destination.Tags,
        destination.AverageBudget,
        destination.BestTravelMonths);

    // Local wire-format copies of DiscoveryService's response shape. AIService owns
    // its own contract here rather than sharing a library, consistent with keeping
    // services independently deployable (see CLAUDE.md architecture rules).
    private sealed record DestinationDto(
        Guid Id,
        string Country,
        string City,
        string Description,
        string[] Tags,
        decimal AverageBudget,
        int[] BestTravelMonths,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    private sealed record RecommendedDestinationDto(
        DestinationDto Destination,
        decimal Score,
        string[] MatchingReasons);
}
