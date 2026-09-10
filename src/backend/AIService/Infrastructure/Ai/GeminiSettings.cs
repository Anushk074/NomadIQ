namespace AIService.Infrastructure.Ai;

public class GeminiSettings
{
    public const string SectionName = "AI:Gemini";

    // Never committed - set via `dotnet user-secrets set "AI:Gemini:ApiKey" "<key>"`
    // in the AIService project directory for local development.
    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = "gemini-3.6-flash";
    public string BaseUrl { get; set; } = "https://generativelanguage.googleapis.com/";
}
