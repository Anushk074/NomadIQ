namespace AIService.Application.Common;

// Thrown for any provider-layer failure: the AI provider was unreachable, returned
// unparseable output, or returned structurally invalid data. Callers must not treat
// a caught response as a usable trip plan (see docs/AI-ARCHITECTURE.md's AI rules).
public class AIProviderException : Exception
{
    public AIProviderException(string message) : base(message)
    {
    }

    public AIProviderException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
