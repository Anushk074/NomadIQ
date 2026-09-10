using AIService.Application.Dtos;

namespace AIService.Application.Abstractions;

public interface IDiscoveryServiceClient
{
    Task<ResolvedDestination?> FindDestinationByNameAsync(string name, CancellationToken cancellationToken = default);

    Task<ResolvedDestination?> GetTopRecommendationAsync(TripPlanRequest request, CancellationToken cancellationToken = default);
}
