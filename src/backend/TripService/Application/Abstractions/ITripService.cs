using TripService.Application.Dtos;

namespace TripService.Application.Abstractions;

public interface ITripService
{
    Task<TripResponse> CreateTripAsync(Guid userId, CreateTripRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TripResponse>> GetTripsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TripResponse?> GetTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default);

    Task<TripResponse?> UpdateTripAsync(Guid userId, Guid tripId, UpdateTripRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default);
}
