namespace AIService.Application.Dtos;

public record TripPlanPromptContext(
    TripPlanRequest Request,
    ResolvedDestination? ResolvedDestination
);
