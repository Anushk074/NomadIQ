namespace TripService.Domain.Entities;

public class ItineraryDay
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public Trip Trip { get; set; } = null!;
    public int DayNumber { get; set; }
    public DateOnly Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public ICollection<Activity> Activities { get; set; } = new List<Activity>();
}
