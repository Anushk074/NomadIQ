namespace AIService.Application.Dtos;

public record SendMessageResponse(string Reply, bool ActionExecuted);

public record ConversationMessageResponse(Guid Id, string Role, string Content, DateTime CreatedAt);
