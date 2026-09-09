using TripService.Domain.Enums;

namespace TripService.Domain.Entities;

public class Trip
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Destination { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal Budget { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string TravelStyle { get; set; } = string.Empty;
    public TripStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
