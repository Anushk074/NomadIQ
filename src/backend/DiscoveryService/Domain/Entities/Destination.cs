namespace DiscoveryService.Domain.Entities;

public class Destination
{
    public Guid Id { get; set; }
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string[] Tags { get; set; } = Array.Empty<string>();
    // Average cost per day for a typical trip, so it can be compared against
    // a requested budget for any trip duration.
    public decimal AverageBudget { get; set; }
    public int[] BestTravelMonths { get; set; } = Array.Empty<int>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
