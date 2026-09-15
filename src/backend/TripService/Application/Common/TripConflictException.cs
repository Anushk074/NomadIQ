namespace TripService.Application.Common;

public class TripConflictException : Exception
{
    public TripConflictException(string message) : base(message)
    {
    }
}
