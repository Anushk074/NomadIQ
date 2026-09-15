namespace AIService.Application.Dtos;

public record ConversationTurn(string Role, string Content);

public record AssistantPromptContext(
    TripDetails Trip,
    ResolvedDestination? Destination,
    IReadOnlyList<ConversationTurn> History,
    string UserMessage
);
