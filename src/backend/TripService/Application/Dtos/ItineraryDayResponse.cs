namespace TripService.Application.Dtos;

public record ItineraryDayResponse(
    Guid Id,
    Guid TripId,
    int DayNumber,
    DateOnly Date,
    string Title,
    string? Notes,
    IReadOnlyList<ActivityResponse> Activities
);
