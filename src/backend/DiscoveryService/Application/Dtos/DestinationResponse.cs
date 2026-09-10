namespace DiscoveryService.Application.Dtos;

public record DestinationResponse(
    Guid Id,
    string Country,
    string City,
    string Description,
    string[] Tags,
    decimal AverageBudget,
    int[] BestTravelMonths,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
