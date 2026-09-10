using AIService.Application.Dtos;

namespace AIService.Application.Abstractions;

public interface IAIProvider
{
    Task<TripPlanResponse> GenerateTripPlanAsync(TripPlanPromptContext context, CancellationToken cancellationToken = default);
}
