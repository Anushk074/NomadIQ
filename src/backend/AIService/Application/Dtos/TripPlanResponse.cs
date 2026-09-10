namespace AIService.Application.Dtos;

public record TripPlanResponse(
    string Destination,
    int DurationDays,
    decimal EstimatedBudget,
    string Currency,
    string Summary,
    IReadOnlyList<TripPlanDay> Days,
    IReadOnlyList<string> Recommendations,
    IReadOnlyList<string> Notes
);

public record TripPlanDay(
    int Day,
    IReadOnlyList<TripPlanActivity> Activities
);

public record TripPlanActivity(
    string Name,
    string? Description,
    decimal? EstimatedCost
);
