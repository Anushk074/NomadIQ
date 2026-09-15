using System.IdentityModel.Tokens.Jwt;
using AIService.Application.Abstractions;
using AIService.Application.Common;
using AIService.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIService.Controllers;

[ApiController]
[Authorize]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly ITripPlannerService _tripPlannerService;
    private readonly IConversationService _conversationService;

    public AiController(ITripPlannerService tripPlannerService, IConversationService conversationService)
    {
        _tripPlannerService = tripPlannerService;
        _conversationService = conversationService;
    }

    [HttpPost("trip-plans")]
    public async Task<IActionResult> CreateTripPlan([FromBody] TripPlanRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var plan = await _tripPlannerService.CreateTripPlanAsync(request, cancellationToken);
            return Ok(plan);
        }
        catch (AIProviderException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                message = "The AI provider could not produce a valid trip plan.",
                detail = ex.Message
            });
        }
    }

    [HttpPost("trips/{tripId:guid}/messages")]
    public async Task<IActionResult> SendMessage(Guid tripId, [FromBody] SendMessageRequest request, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        try
        {
            var result = await _conversationService.SendMessageAsync(userId, tripId, request.Message, cancellationToken);

            return result is null ? NotFound() : Ok(result);
        }
        catch (AIProviderException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                message = "The AI provider could not produce a response.",
                detail = ex.Message
            });
        }
        catch (TripServiceException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                message = "TripService is currently unavailable.",
                detail = ex.Message
            });
        }
    }

    [HttpGet("trips/{tripId:guid}/messages")]
    public async Task<IActionResult> GetMessages(Guid tripId, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        try
        {
            var history = await _conversationService.GetHistoryAsync(userId, tripId, cancellationToken);

            return history is null ? NotFound() : Ok(history);
        }
        catch (TripServiceException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                message = "TripService is currently unavailable.",
                detail = ex.Message
            });
        }
    }

    private bool TryGetUserId(out Guid userId)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        return Guid.TryParse(userIdClaim, out userId);
    }
}
