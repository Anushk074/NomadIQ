namespace DiscoveryService.Application.Dtos;

public record RecommendedDestinationResponse(
    DestinationResponse Destination,
    decimal Score,
    string[] MatchingReasons
);
