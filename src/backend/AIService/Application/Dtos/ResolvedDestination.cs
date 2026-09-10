namespace AIService.Application.Dtos;

public record ResolvedDestination(
    string City,
    string Country,
    string Description,
    string[] Tags,
    decimal AverageBudgetPerDay,
    int[] BestTravelMonths
);
