using TripService.Domain.Enums;

namespace TripService.Application.Dtos;

public record TripResponse(
    Guid Id,
    Guid UserId,
    string Destination,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal Budget,
    string Currency,
    string TravelStyle,
    TripStatus Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
