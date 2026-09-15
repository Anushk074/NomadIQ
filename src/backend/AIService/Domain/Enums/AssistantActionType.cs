namespace AIService.Domain.Enums;

// Closed set of actions the assistant may propose - derived directly from TripService's
// existing mutation endpoints. Gemini may never request anything outside this set.
public enum AssistantActionType
{
    None,
    UpdateTripBudget,
    UpdateTripStatus,
    AddActivity,
    UpdateActivity,
    DeleteActivity
}
