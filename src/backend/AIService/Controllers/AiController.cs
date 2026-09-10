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

    public AiController(ITripPlannerService tripPlannerService)
    {
        _tripPlannerService = tripPlannerService;
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
}
