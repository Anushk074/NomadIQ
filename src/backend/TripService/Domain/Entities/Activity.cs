namespace TripService.Domain.Entities;

public class Activity
{
    public Guid Id { get; set; }
    public Guid ItineraryDayId { get; set; }
    public ItineraryDay ItineraryDay { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public decimal? EstimatedCost { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
}
