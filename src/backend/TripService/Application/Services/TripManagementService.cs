using Microsoft.EntityFrameworkCore;
using TripService.Application.Abstractions;
using TripService.Application.Common;
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
        var trips = await TripsWithItinerary()
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

        return trips.Select(ToResponse).ToList();
    }

    public async Task<TripResponse?> GetTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default)
    {
        var trip = await TripsWithItinerary()
            .SingleOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);

        return trip is null ? null : ToResponse(trip);
    }

    public async Task<TripResponse?> UpdateTripAsync(Guid userId, Guid tripId, UpdateTripRequest request, CancellationToken cancellationToken = default)
    {
        var trip = await TripsWithItinerary()
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
        var trip = await FindOwnedTripAsync(userId, tripId, cancellationToken);

        if (trip is null)
        {
            return false;
        }

        _dbContext.Trips.Remove(trip);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<ItineraryDayResponse?> CreateItineraryDayAsync(Guid userId, Guid tripId, CreateItineraryDayRequest request, CancellationToken cancellationToken = default)
    {
        var trip = await FindOwnedTripAsync(userId, tripId, cancellationToken);

        if (trip is null)
        {
            return null;
        }

        await EnsureDayNumberIsAvailableAsync(tripId, request.DayNumber, excludingDayId: null, cancellationToken);

        var day = new ItineraryDay
        {
            Id = Guid.NewGuid(),
            TripId = tripId,
            DayNumber = request.DayNumber,
            Date = request.Date,
            Title = request.Title.Trim(),
            Notes = NormalizeOptional(request.Notes)
        };

        _dbContext.ItineraryDays.Add(day);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToResponse(day, []);
    }

    public async Task<ItineraryDayResponse?> GetItineraryDayAsync(Guid userId, Guid tripId, Guid dayId, CancellationToken cancellationToken = default)
    {
        var day = await FindOwnedDayAsync(userId, tripId, dayId, cancellationToken);

        return day is null ? null : ToResponse(day, day.Activities.Select(ToResponse).ToList());
    }

    public async Task<ItineraryDayResponse?> UpdateItineraryDayAsync(Guid userId, Guid tripId, Guid dayId, UpdateItineraryDayRequest request, CancellationToken cancellationToken = default)
    {
        var day = await FindOwnedDayAsync(userId, tripId, dayId, cancellationToken);

        if (day is null)
        {
            return null;
        }

        await EnsureDayNumberIsAvailableAsync(tripId, request.DayNumber, excludingDayId: dayId, cancellationToken);

        day.DayNumber = request.DayNumber;
        day.Date = request.Date;
        day.Title = request.Title.Trim();
        day.Notes = NormalizeOptional(request.Notes);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToResponse(day, day.Activities.Select(ToResponse).ToList());
    }

    public async Task<bool> DeleteItineraryDayAsync(Guid userId, Guid tripId, Guid dayId, CancellationToken cancellationToken = default)
    {
        var day = await FindOwnedDayAsync(userId, tripId, dayId, cancellationToken);

        if (day is null)
        {
            return false;
        }

        _dbContext.ItineraryDays.Remove(day);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<ActivityResponse?> CreateActivityAsync(Guid userId, Guid tripId, Guid dayId, CreateActivityRequest request, CancellationToken cancellationToken = default)
    {
        var day = await FindOwnedDayAsync(userId, tripId, dayId, cancellationToken);

        if (day is null)
        {
            return null;
        }

        var activity = new Activity
        {
            Id = Guid.NewGuid(),
            ItineraryDayId = dayId,
            Name = request.Name.Trim(),
            Description = NormalizeOptional(request.Description),
            Location = NormalizeOptional(request.Location),
            EstimatedCost = request.EstimatedCost,
            StartTime = request.StartTime,
            EndTime = request.EndTime
        };

        _dbContext.Activities.Add(activity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToResponse(activity);
    }

    public async Task<ActivityResponse?> GetActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken = default)
    {
        var activity = await FindOwnedActivityAsync(userId, tripId, dayId, activityId, cancellationToken);

        return activity is null ? null : ToResponse(activity);
    }

    public async Task<ActivityResponse?> UpdateActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, UpdateActivityRequest request, CancellationToken cancellationToken = default)
    {
        var activity = await FindOwnedActivityAsync(userId, tripId, dayId, activityId, cancellationToken);

        if (activity is null)
        {
            return null;
        }

        activity.Name = request.Name.Trim();
        activity.Description = NormalizeOptional(request.Description);
        activity.Location = NormalizeOptional(request.Location);
        activity.EstimatedCost = request.EstimatedCost;
        activity.StartTime = request.StartTime;
        activity.EndTime = request.EndTime;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToResponse(activity);
    }

    public async Task<bool> DeleteActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken = default)
    {
        var activity = await FindOwnedActivityAsync(userId, tripId, dayId, activityId, cancellationToken);

        if (activity is null)
        {
            return false;
        }

        _dbContext.Activities.Remove(activity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return true;
    }

    private IQueryable<Trip> TripsWithItinerary() =>
        _dbContext.Trips
            .Include(t => t.Days.OrderBy(d => d.DayNumber))
            .ThenInclude(d => d.Activities.OrderBy(a => a.StartTime));

    private Task<Trip?> FindOwnedTripAsync(Guid userId, Guid tripId, CancellationToken cancellationToken) =>
        _dbContext.Trips.SingleOrDefaultAsync(t => t.Id == tripId && t.UserId == userId, cancellationToken);

    private Task<ItineraryDay?> FindOwnedDayAsync(Guid userId, Guid tripId, Guid dayId, CancellationToken cancellationToken) =>
        _dbContext.ItineraryDays
            .Include(d => d.Activities.OrderBy(a => a.StartTime))
            .SingleOrDefaultAsync(d => d.Id == dayId && d.TripId == tripId && d.Trip.UserId == userId, cancellationToken);

    private Task<Activity?> FindOwnedActivityAsync(Guid userId, Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken) =>
        _dbContext.Activities
            .SingleOrDefaultAsync(
                a => a.Id == activityId && a.ItineraryDayId == dayId && a.ItineraryDay.TripId == tripId && a.ItineraryDay.Trip.UserId == userId,
                cancellationToken);

    private async Task EnsureDayNumberIsAvailableAsync(Guid tripId, int dayNumber, Guid? excludingDayId, CancellationToken cancellationToken)
    {
        var conflict = await _dbContext.ItineraryDays.AnyAsync(
            d => d.TripId == tripId && d.DayNumber == dayNumber && d.Id != excludingDayId,
            cancellationToken);

        if (conflict)
        {
            throw new TripConflictException($"Day {dayNumber} already exists for this trip.");
        }
    }

    private static string? NormalizeOptional(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

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
        trip.UpdatedAt,
        trip.Days.Select(d => ToResponse(d, d.Activities.Select(ToResponse).ToList())).ToList());

    private static ItineraryDayResponse ToResponse(ItineraryDay day, IReadOnlyList<ActivityResponse> activities) => new(
        day.Id,
        day.TripId,
        day.DayNumber,
        day.Date,
        day.Title,
        day.Notes,
        activities);

    private static ActivityResponse ToResponse(Activity activity) => new(
        activity.Id,
        activity.ItineraryDayId,
        activity.Name,
        activity.Description,
        activity.Location,
        activity.EstimatedCost,
        activity.StartTime,
        activity.EndTime);
}
