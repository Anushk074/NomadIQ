using AIService.Application.Dtos;

namespace AIService.Application.Abstractions;

public interface ITripPlannerService
{
    Task<TripPlanResponse> CreateTripPlanAsync(TripPlanRequest request, CancellationToken cancellationToken = default);
}
