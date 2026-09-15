using AIService.Domain.Enums;

namespace AIService.Application.Dtos;

// Every field is optional; which ones are actually required depends on Type and is
// enforced by ConversationService, never assumed just because Gemini populated them.
public record AssistantAction(
    AssistantActionType Type,
    int? DayNumber,
    Guid? ActivityId,
    decimal? Budget,
    TripStatus? Status,
    string? Name,
    string? Description,
    string? Location,
    decimal? EstimatedCost,
    TimeOnly? StartTime,
    TimeOnly? EndTime
);

public record AssistantReply(string Reply, AssistantAction Action);
