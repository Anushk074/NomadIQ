namespace TripService.Application.Dtos;

public record ActivityResponse(
    Guid Id,
    Guid ItineraryDayId,
    string Name,
    string? Description,
    string? Location,
    decimal? EstimatedCost,
    TimeOnly? StartTime,
    TimeOnly? EndTime
);
