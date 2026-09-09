using Microsoft.EntityFrameworkCore;
using TripService.Application.Abstractions;
using TripService.Application.Dtos;
using TripService.Domain.Entities;
using TripService.Domain.Enums;
using TripService.Infrastructure.Persistence;

namespace TripService.Application.Services;

public class TripManagementService : ITripService
{
    private readonly TripDbContext _dbContext;

    public TripManagementService(TripDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TripResponse> CreateTripAsync(Guid userId, CreateTripRequest request, CancellationToken cancellationToken = default)
    {
        var trip = new Trip
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Destination = request.Destination.Trim(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Budget = request.Budget,
            Currency = request.Currency.Trim().ToUpperInvariant(),
            TravelStyle = request.TravelStyle.Trim(),
            Status = TripStatus.Planning,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Trips.Add(trip);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToResponse(trip);
    }

    public async Task<IReadOnlyList<TripResponse>> GetTripsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var trips = await _dbContext.Trips
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

        return trips.Select(ToResponse).ToList();
    }

    public async Task<TripResponse?> GetTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default)
    {
        var trip = await _dbContext.Trips
            .SingleOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);

        return trip is null ? null : ToResponse(trip);
    }

    public async Task<TripResponse?> UpdateTripAsync(Guid userId, Guid tripId, UpdateTripRequest request, CancellationToken cancellationToken = default)
    {
        var trip = await _dbContext.Trips
            .SingleOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);

        if (trip is null)
        {
            return null;
        }

        trip.Destination = request.Destination.Trim();
        trip.StartDate = request.StartDate;
        trip.EndDate = request.EndDate;
        trip.Budget = request.Budget;
        trip.Currency = request.Currency.Trim().ToUpperInvariant();
        trip.TravelStyle = request.TravelStyle.Trim();
        trip.Status = request.Status;
        trip.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToResponse(trip);
    }

    public async Task<bool> DeleteTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default)
    {
        var trip = await _dbContext.Trips
            .SingleOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);

        if (trip is null)
        {
            return false;
        }

        _dbContext.Trips.Remove(trip);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static TripResponse ToResponse(Trip trip) => new(
        trip.Id,
        trip.UserId,
        trip.Destination,
        trip.StartDate,
        trip.EndDate,
        trip.Budget,
        trip.Currency,
        trip.TravelStyle,
        trip.Status,
        trip.CreatedAt,
        trip.UpdatedAt);
}
