using AIService.Application.Dtos;

namespace AIService.Application.Abstractions;

public interface IConversationService
{
    // Returns null when the trip doesn't exist or doesn't belong to userId.
    Task<SendMessageResponse?> SendMessageAsync(Guid userId, Guid tripId, string message, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ConversationMessageResponse>?> GetHistoryAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default);
}
