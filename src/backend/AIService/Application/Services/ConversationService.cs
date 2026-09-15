using AIService.Application.Abstractions;
using AIService.Application.Common;
using AIService.Application.Dtos;
using AIService.Domain.Entities;
using AIService.Domain.Enums;
using AIService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AIService.Application.Services;

public class ConversationService : IConversationService
{
    private const int MaxHistoryMessages = 10;

    private readonly AiDbContext _dbContext;
    private readonly ITripServiceClient _tripServiceClient;
    private readonly IDiscoveryServiceClient _discoveryServiceClient;
    private readonly IAIProvider _aiProvider;

    public ConversationService(
        AiDbContext dbContext,
        ITripServiceClient tripServiceClient,
        IDiscoveryServiceClient discoveryServiceClient,
        IAIProvider aiProvider)
    {
        _dbContext = dbContext;
        _tripServiceClient = tripServiceClient;
        _discoveryServiceClient = discoveryServiceClient;
        _aiProvider = aiProvider;
    }

    public async Task<SendMessageResponse?> SendMessageAsync(Guid userId, Guid tripId, string message, CancellationToken cancellationToken = default)
    {
        var trip = await _tripServiceClient.GetTripAsync(tripId, cancellationToken);

        if (trip is null || trip.UserId != userId)
        {
            return null;
        }

        var conversation = await _dbContext.Conversations
            .SingleOrDefaultAsync(c => c.UserId == userId && c.TripId == tripId, cancellationToken);

        var isNewConversation = conversation is null;

        conversation ??= new Conversation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TripId = tripId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var history = await LoadRecentHistoryAsync(isNewConversation, conversation.Id, cancellationToken);

        ResolvedDestination? destination = null;
        if (!string.IsNullOrWhiteSpace(trip.Destination))
        {
            destination = await _discoveryServiceClient.FindDestinationByNameAsync(trip.Destination, cancellationToken);
        }

        var promptContext = new AssistantPromptContext(trip, destination, history, message);
        var assistantReply = await _aiProvider.GenerateAssistantReplyAsync(promptContext, cancellationToken);

        var replyText = assistantReply.Reply;
        var actionExecuted = false;

        if (assistantReply.Action.Type != AssistantActionType.None)
        {
            try
            {
                actionExecuted = await TryExecuteActionAsync(tripId, trip, assistantReply.Action, cancellationToken);
            }
            catch (TripServiceException)
            {
                // TripService itself failed to apply the change. This is not surfaced as a
                // hard error to the caller - the conversation still succeeded, the side
                // effect just didn't happen, and the reply below says so honestly.
                actionExecuted = false;
            }

            replyText = actionExecuted
                ? $"{replyText}\n\n(I've applied that change.)"
                : $"{replyText}\n\n(I wasn't able to safely apply that change, so no changes were made.)";
        }

        _dbContext.ConversationMessages.Add(new ConversationMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Role = MessageRole.User,
            Content = message,
            CreatedAt = DateTime.UtcNow
        });

        _dbContext.ConversationMessages.Add(new ConversationMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Role = MessageRole.Assistant,
            Content = replyText,
            CreatedAt = DateTime.UtcNow
        });

        conversation.UpdatedAt = DateTime.UtcNow;

        if (isNewConversation)
        {
            _dbContext.Conversations.Add(conversation);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new SendMessageResponse(replyText, actionExecuted);
    }

    public async Task<IReadOnlyList<ConversationMessageResponse>?> GetHistoryAsync(Guid userId, Guid tripId, CancellationToken cancellationToken = default)
    {
        var trip = await _tripServiceClient.GetTripAsync(tripId, cancellationToken);

        if (trip is null || trip.UserId != userId)
        {
            return null;
        }

        var conversation = await _dbContext.Conversations
            .SingleOrDefaultAsync(c => c.UserId == userId && c.TripId == tripId, cancellationToken);

        if (conversation is null)
        {
            return [];
        }

        var messages = await _dbContext.ConversationMessages
            .Where(m => m.ConversationId == conversation.Id)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(cancellationToken);

        return messages
            .Select(m => new ConversationMessageResponse(m.Id, m.Role.ToString(), m.Content, m.CreatedAt))
            .ToList();
    }

    private async Task<List<ConversationTurn>> LoadRecentHistoryAsync(bool isNewConversation, Guid conversationId, CancellationToken cancellationToken)
    {
        if (isNewConversation)
        {
            return [];
        }

        var recentDescending = await _dbContext.ConversationMessages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Take(MaxHistoryMessages)
            .ToListAsync(cancellationToken);

        recentDescending.Reverse();

        return recentDescending
            .Select(m => new ConversationTurn(m.Role.ToString(), m.Content))
            .ToList();
    }

    // Validates the action's own required fields AND that any referenced day/activity
    // actually exists in the trip we just fetched (which was itself ownership-verified by
    // TripService) - never trusts an id just because Gemini produced a well-formed Guid.
    private async Task<bool> TryExecuteActionAsync(Guid tripId, TripDetails trip, AssistantAction action, CancellationToken cancellationToken)
    {
        switch (action.Type)
        {
            case AssistantActionType.None:
                return false;

            case AssistantActionType.UpdateTripBudget:
                if (action.Budget is not { } budget || budget <= 0)
                {
                    return false;
                }

                await _tripServiceClient.UpdateTripAsync(tripId, trip, budget: budget, status: null, cancellationToken);
                return true;

            case AssistantActionType.UpdateTripStatus:
                if (action.Status is not { } status)
                {
                    return false;
                }

                await _tripServiceClient.UpdateTripAsync(tripId, trip, budget: null, status: status.ToString(), cancellationToken);
                return true;

            case AssistantActionType.AddActivity:
                if (action.DayNumber is not { } dayNumber || string.IsNullOrWhiteSpace(action.Name))
                {
                    return false;
                }

                var targetDay = trip.Days.FirstOrDefault(d => d.DayNumber == dayNumber);
                if (targetDay is null)
                {
                    return false;
                }

                await _tripServiceClient.CreateActivityAsync(
                    tripId, targetDay.Id, action.Name.Trim(), action.Description, action.Location,
                    action.EstimatedCost, action.StartTime, action.EndTime, cancellationToken);
                return true;

            case AssistantActionType.UpdateActivity:
                if (action.ActivityId is not { } updateActivityId)
                {
                    return false;
                }

                var toUpdate = FindActivity(trip, updateActivityId);
                if (toUpdate is null)
                {
                    return false;
                }

                await _tripServiceClient.UpdateActivityAsync(
                    tripId,
                    toUpdate.Value.Day.Id,
                    updateActivityId,
                    string.IsNullOrWhiteSpace(action.Name) ? toUpdate.Value.Activity.Name : action.Name.Trim(),
                    action.Description ?? toUpdate.Value.Activity.Description,
                    action.Location ?? toUpdate.Value.Activity.Location,
                    action.EstimatedCost ?? toUpdate.Value.Activity.EstimatedCost,
                    action.StartTime ?? toUpdate.Value.Activity.StartTime,
                    action.EndTime ?? toUpdate.Value.Activity.EndTime,
                    cancellationToken);
                return true;

            case AssistantActionType.DeleteActivity:
                if (action.ActivityId is not { } deleteActivityId)
                {
                    return false;
                }

                var toDelete = FindActivity(trip, deleteActivityId);
                if (toDelete is null)
                {
                    return false;
                }

                await _tripServiceClient.DeleteActivityAsync(tripId, toDelete.Value.Day.Id, deleteActivityId, cancellationToken);
                return true;

            default:
                return false;
        }
    }

    private static (ItineraryDayDetails Day, ActivityDetails Activity)? FindActivity(TripDetails trip, Guid activityId)
    {
        foreach (var day in trip.Days)
        {
            var activity = day.Activities.FirstOrDefault(a => a.Id == activityId);
            if (activity is not null)
            {
                return (day, activity);
            }
        }

        return null;
    }
}
