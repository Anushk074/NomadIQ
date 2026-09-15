namespace AIService.Application.Dtos;

// AIService's own read model for a trip fetched over HTTP from TripService - not the raw
// wire shape (that stays private inside TripServiceClient), and not shared assembly types.
public record TripDetails(
    Guid Id,
    Guid UserId,
    string Destination,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal Budget,
    string Currency,
    string TravelStyle,
    string Status,
    IReadOnlyList<ItineraryDayDetails> Days
);

public record ItineraryDayDetails(
    Guid Id,
    int DayNumber,
    DateOnly Date,
    string Title,
    string? Notes,
    IReadOnlyList<ActivityDetails> Activities
);

public record ActivityDetails(
    Guid Id,
    Guid ItineraryDayId,
    string Name,
    string? Description,
    string? Location,
    decimal? EstimatedCost,
    TimeOnly? StartTime,
    TimeOnly? EndTime
);
