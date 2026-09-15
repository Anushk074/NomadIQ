using AIService.Application.Dtos;

namespace AIService.Application.Abstractions;

public interface ITripServiceClient
{
    Task<TripDetails?> GetTripAsync(Guid tripId, CancellationToken cancellationToken = default);

    Task<TripDetails> UpdateTripAsync(Guid tripId, TripDetails currentTrip, decimal? budget, string? status, CancellationToken cancellationToken = default);

    Task<ActivityDetails> CreateActivityAsync(
        Guid tripId, Guid dayId, string name, string? description, string? location,
        decimal? estimatedCost, TimeOnly? startTime, TimeOnly? endTime, CancellationToken cancellationToken = default);

    Task<ActivityDetails> UpdateActivityAsync(
        Guid tripId, Guid dayId, Guid activityId, string name, string? description, string? location,
        decimal? estimatedCost, TimeOnly? startTime, TimeOnly? endTime, CancellationToken cancellationToken = default);

    Task DeleteActivityAsync(Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken = default);
}
