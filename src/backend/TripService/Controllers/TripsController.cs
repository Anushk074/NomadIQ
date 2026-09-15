using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripService.Application.Abstractions;
using TripService.Application.Common;
using TripService.Application.Dtos;

namespace TripService.Controllers;

[ApiController]
[Authorize]
[Route("api/trips")]
public class TripsController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripsController(ITripService tripService)
    {
        _tripService = tripService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTripRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var trip = await _tripService.CreateTripAsync(userId, request, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = trip.Id }, trip);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var trips = await _tripService.GetTripsAsync(userId, cancellationToken);

        return Ok(trips);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var trip = await _tripService.GetTripAsync(userId, id, cancellationToken);

        return trip is null ? NotFound() : Ok(trip);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTripRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var trip = await _tripService.UpdateTripAsync(userId, id, request, cancellationToken);

        return trip is null ? NotFound() : Ok(trip);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var deleted = await _tripService.DeleteTripAsync(userId, id, cancellationToken);

        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{tripId:guid}/days")]
    public async Task<IActionResult> CreateItineraryDay(Guid tripId, [FromBody] CreateItineraryDayRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        try
        {
            var day = await _tripService.CreateItineraryDayAsync(userId, tripId, request, cancellationToken);

            return day is null
                ? NotFound()
                : CreatedAtAction(nameof(GetItineraryDay), new { tripId, dayId = day.Id }, day);
        }
        catch (TripConflictException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("{tripId:guid}/days/{dayId:guid}")]
    public async Task<IActionResult> GetItineraryDay(Guid tripId, Guid dayId, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var day = await _tripService.GetItineraryDayAsync(userId, tripId, dayId, cancellationToken);

        return day is null ? NotFound() : Ok(day);
    }

    [HttpPut("{tripId:guid}/days/{dayId:guid}")]
    public async Task<IActionResult> UpdateItineraryDay(Guid tripId, Guid dayId, [FromBody] UpdateItineraryDayRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        try
        {
            var day = await _tripService.UpdateItineraryDayAsync(userId, tripId, dayId, request, cancellationToken);

            return day is null ? NotFound() : Ok(day);
        }
        catch (TripConflictException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{tripId:guid}/days/{dayId:guid}")]
    public async Task<IActionResult> DeleteItineraryDay(Guid tripId, Guid dayId, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var deleted = await _tripService.DeleteItineraryDayAsync(userId, tripId, dayId, cancellationToken);

        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{tripId:guid}/days/{dayId:guid}/activities")]
    public async Task<IActionResult> CreateActivity(Guid tripId, Guid dayId, [FromBody] CreateActivityRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var activity = await _tripService.CreateActivityAsync(userId, tripId, dayId, request, cancellationToken);

        return activity is null
            ? NotFound()
            : CreatedAtAction(nameof(GetActivity), new { tripId, dayId, activityId = activity.Id }, activity);
    }

    [HttpGet("{tripId:guid}/days/{dayId:guid}/activities/{activityId:guid}")]
    public async Task<IActionResult> GetActivity(Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var activity = await _tripService.GetActivityAsync(userId, tripId, dayId, activityId, cancellationToken);

        return activity is null ? NotFound() : Ok(activity);
    }

    [HttpPut("{tripId:guid}/days/{dayId:guid}/activities/{activityId:guid}")]
    public async Task<IActionResult> UpdateActivity(Guid tripId, Guid dayId, Guid activityId, [FromBody] UpdateActivityRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var activity = await _tripService.UpdateActivityAsync(userId, tripId, dayId, activityId, request, cancellationToken);

        return activity is null ? NotFound() : Ok(activity);
    }

    [HttpDelete("{tripId:guid}/days/{dayId:guid}/activities/{activityId:guid}")]
    public async Task<IActionResult> DeleteActivity(Guid tripId, Guid dayId, Guid activityId, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var deleted = await _tripService.DeleteActivityAsync(userId, tripId, dayId, activityId, cancellationToken);

        return deleted ? NoContent() : NotFound();
    }

    private bool TryGetUserId(out Guid userId)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(userIdClaim, out userId);
    }
}
