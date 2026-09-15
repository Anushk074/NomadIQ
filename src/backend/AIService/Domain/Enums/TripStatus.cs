namespace AIService.Domain.Enums;

// Mirrors TripService.Domain.Enums.TripStatus. Duplicated rather than shared, consistent
// with keeping services independently deployable - AIService only needs this to validate
// and forward a status value, never to reason about trip lifecycle itself.
public enum TripStatus
{
    Planning,
    Confirmed,
    Completed,
    Cancelled
}
