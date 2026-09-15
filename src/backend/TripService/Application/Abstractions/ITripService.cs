using TripService.Application.Dtos;

namespace TripService.Application.Abstractions;

public interface ITripService
{
    Task<TripResponse> CreateTripAsync(Guid userId, CreateTripRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TripResponse>> GetTripsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TripResponse?> GetTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default);

    Task<TripResponse?> UpdateTripAsync(Guid userId, Guid tripId, UpdateTripRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default);

    Task<ItineraryDayResponse?> CreateItineraryDayAsync(Guid userId, Guid tripId, CreateItineraryDayRequest request, CancellationToken cancellationToken = default);

    Task<ItineraryDayResponse?> GetItineraryDayAsync(Guid userId, Guid tripId, Guid dayId, CancellationToken cancellationToken = default);

    Task<ItineraryDayResponse?> UpdateItineraryDayAsync(Guid userId, Guid tripId, Guid dayId, UpdateItineraryDayRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteItineraryDayAsync(Guid userId, Guid tripId, Guid dayId, CancellationToken cancellationToken = default);

    Task<ActivityResponse?> CreateActivityAsync(Guid userId, Guid tripId, Guid dayId, CreateActivityRequest request, CancellationToken cancellationToken = default);

    Task<ActivityResponse?> GetActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken = default);

    Task<ActivityResponse?> UpdateActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, UpdateActivityRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken = default);
}
