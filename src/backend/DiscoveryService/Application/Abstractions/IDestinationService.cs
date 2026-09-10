using DiscoveryService.Application.Dtos;

namespace DiscoveryService.Application.Abstractions;

public interface IDestinationService
{
    Task<IReadOnlyList<DestinationResponse>> GetDestinationsAsync(CancellationToken cancellationToken = default);

    Task<DestinationResponse?> GetDestinationAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<RecommendedDestinationResponse>> GetRecommendationsAsync(DestinationRecommendationRequest request, CancellationToken cancellationToken = default);
}
