using AIService.Application.Abstractions;
using AIService.Application.Common;
using AIService.Application.Dtos;

namespace AIService.Application.Services;

public class TripPlannerService : ITripPlannerService
{
    private readonly IDiscoveryServiceClient _discoveryServiceClient;
    private readonly IAIProvider _aiProvider;

    public TripPlannerService(IDiscoveryServiceClient discoveryServiceClient, IAIProvider aiProvider)
    {
        _discoveryServiceClient = discoveryServiceClient;
        _aiProvider = aiProvider;
    }

    public async Task<TripPlanResponse> CreateTripPlanAsync(TripPlanRequest request, CancellationToken cancellationToken = default)
    {
        ResolvedDestination? resolvedDestination;
        var destinationWasRequestedButNotFound = false;

        if (!string.IsNullOrWhiteSpace(request.Destination))
        {
            resolvedDestination = await _discoveryServiceClient.FindDestinationByNameAsync(request.Destination, cancellationToken);
            destinationWasRequestedButNotFound = resolvedDestination is null;
        }
        else
        {
            resolvedDestination = await _discoveryServiceClient.GetTopRecommendationAsync(request, cancellationToken);
        }

        var context = new TripPlanPromptContext(request, resolvedDestination);

        var plan = await _aiProvider.GenerateTripPlanAsync(context, cancellationToken);

        ValidatePlanShape(plan, request);

        if (destinationWasRequestedButNotFound)
        {
            plan = plan with
            {
                Notes =
                [
                    .. plan.Notes,
                    $"\"{request.Destination}\" is not in our curated destination catalog; this itinerary is based on general knowledge and may be less precise."
                ]
            };
        }

        return plan;
    }

    // The AI model's output must not be trusted blindly (docs/AI-ARCHITECTURE.md).
    // This checks structural shape only, not travel-quality - that's the model's job.
    private static void ValidatePlanShape(TripPlanResponse plan, TripPlanRequest request)
    {
        if (string.IsNullOrWhiteSpace(plan.Destination) || string.IsNullOrWhiteSpace(plan.Summary))
        {
            throw new AIProviderException("The AI provider returned a trip plan with a missing destination or summary.");
        }

        if (plan.Days is null || plan.Days.Count != request.DurationDays)
        {
            throw new AIProviderException(
                $"The AI provider returned {plan.Days?.Count ?? 0} day(s), but {request.DurationDays} were requested.");
        }

        for (var i = 0; i < plan.Days.Count; i++)
        {
            var expectedDayNumber = i + 1;
            if (plan.Days[i].Day != expectedDayNumber)
            {
                throw new AIProviderException(
                    $"The AI provider returned day numbers out of order (expected day {expectedDayNumber}).");
            }
        }

        if (plan.EstimatedBudget <= 0)
        {
            throw new AIProviderException("The AI provider returned a non-positive estimated budget.");
        }
    }
}
