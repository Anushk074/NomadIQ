using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using AIService.Application.Abstractions;
using AIService.Application.Common;
using AIService.Application.Dtos;

namespace AIService.Infrastructure.Clients;

public class TripServiceClient : ITripServiceClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;

    public TripServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<TripDetails?> GetTripAsync(Guid tripId, CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.GetAsync($"api/trips/{tripId}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        if (!response.IsSuccessStatusCode)
        {
            throw new TripServiceException($"TripService request failed with status {(int)response.StatusCode}.");
        }

        var trip = await response.Content.ReadFromJsonAsync<TripDto>(JsonOptions, cancellationToken);

        return trip is null ? null : ToTripDetails(trip);
    }

    public async Task<TripDetails> UpdateTripAsync(Guid tripId, TripDetails currentTrip, decimal? budget, string? status, CancellationToken cancellationToken = default)
    {
        var payload = new
        {
            destination = currentTrip.Destination,
            startDate = currentTrip.StartDate,
            endDate = currentTrip.EndDate,
            budget = budget ?? currentTrip.Budget,
            currency = currentTrip.Currency,
            travelStyle = currentTrip.TravelStyle,
            status = status ?? currentTrip.Status
        };

        using var response = await _httpClient.PutAsJsonAsync($"api/trips/{tripId}", payload, JsonOptions, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new TripServiceException($"TripService rejected the trip update with status {(int)response.StatusCode}.");
        }

        var trip = await response.Content.ReadFromJsonAsync<TripDto>(JsonOptions, cancellationToken)
            ?? throw new TripServiceException("TripService returned an empty response for a trip update.");

        return ToTripDetails(trip);
    }

    public async Task<ActivityDetails> CreateActivityAsync(
        Guid tripId, Guid dayId, string name, string? description, string? location,
        decimal? estimatedCost, TimeOnly? startTime, TimeOnly? endTime, CancellationToken cancellationToken = default)
    {
        var payload = new { name, description, location, estimatedCost, startTime, endTime };

        using var response = await _httpClient.PostAsJsonAsync($"api/trips/{tripId}/days/{dayId}/activities", payload, JsonOptions, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new TripServiceException($"TripService rejected the activity creation with status {(int)response.StatusCode}.");
        }

        var activity = await response.Content.ReadFromJsonAsync<ActivityDto>(JsonOptions, cancellationToken)
            ?? throw new TripServiceException("TripService returned an empty response for an activity creation.");

        return ToActivityDetails(activity);
    }

    public async Task<ActivityDetails> UpdateActivityAsync(
        Guid tripId, Guid dayId, Guid activityId, string name, string? description, string? location,
        decimal? estimatedCost, TimeOnly? startTime, TimeOnly? endTime, CancellationToken cancellationToken = default)
    {
        var payload = new { name, description, location, estimatedCost, startTime, endTime };

        using var response = await _httpClient.PutAsJsonAsync($"api/trips/{tripId}/days/{dayId}/activities/{activityId}", payload, JsonOptions, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new TripServiceException($"TripService rejected the activity update with status {(int)response.StatusCode}.");
        }

        var activity = await response.Content.ReadFromJsonAsync<ActivityDto>(JsonOptions, cancellationToken)
            ?? throw new TripServiceException("TripService returned an empty response for an activity update.");

        return ToActivityDetails(activity);
    }

    public async Task DeleteActivityAsync(Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.DeleteAsync($"api/trips/{tripId}/days/{dayId}/activities/{activityId}", cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new TripServiceException($"TripService rejected the activity deletion with status {(int)response.StatusCode}.");
        }
    }

    private static TripDetails ToTripDetails(TripDto trip) => new(
        trip.Id,
        trip.UserId,
        trip.Destination,
        trip.StartDate,
        trip.EndDate,
        trip.Budget,
        trip.Currency,
        trip.TravelStyle,
        trip.Status,
        trip.Days.Select(ToItineraryDayDetails).ToList());

    private static ItineraryDayDetails ToItineraryDayDetails(ItineraryDayDto day) => new(
        day.Id,
        day.DayNumber,
        day.Date,
        day.Title,
        day.Notes,
        day.Activities.Select(ToActivityDetails).ToList());

    private static ActivityDetails ToActivityDetails(ActivityDto activity) => new(
        activity.Id,
        activity.ItineraryDayId,
        activity.Name,
        activity.Description,
        activity.Location,
        activity.EstimatedCost,
        activity.StartTime,
        activity.EndTime);

    // Local wire-format copies of TripService's response shape - see DiscoveryServiceClient
    // for the same pattern. AIService never shares an assembly or a database with TripService.
    private sealed record TripDto(
        Guid Id, Guid UserId, string Destination, DateOnly StartDate, DateOnly EndDate,
        decimal Budget, string Currency, string TravelStyle, string Status,
        DateTime CreatedAt, DateTime UpdatedAt, List<ItineraryDayDto> Days);

    private sealed record ItineraryDayDto(
        Guid Id, Guid TripId, int DayNumber, DateOnly Date, string Title, string? Notes,
        List<ActivityDto> Activities);

    private sealed record ActivityDto(
        Guid Id, Guid ItineraryDayId, string Name, string? Description, string? Location,
        decimal? EstimatedCost, TimeOnly? StartTime, TimeOnly? EndTime);
}
