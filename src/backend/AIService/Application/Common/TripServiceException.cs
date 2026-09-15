namespace AIService.Application.Common;

// Thrown when TripService is unreachable or rejects a request unexpectedly (not a normal
// "not found" - callers signal that with null, matching the rest of the codebase's pattern).
public class TripServiceException : Exception
{
    public TripServiceException(string message) : base(message)
    {
    }

    public TripServiceException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
