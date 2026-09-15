using AIService.Application.Dtos;

namespace AIService.Application.Abstractions;

public interface IAIProvider
{
    Task<TripPlanResponse> GenerateTripPlanAsync(TripPlanPromptContext context, CancellationToken cancellationToken = default);

    Task<AssistantReply> GenerateAssistantReplyAsync(AssistantPromptContext context, CancellationToken cancellationToken = default);
}
