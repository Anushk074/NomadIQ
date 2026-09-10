using DiscoveryService.Application.Abstractions;
using DiscoveryService.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace DiscoveryService.Controllers;

[ApiController]
[Route("api/destinations")]
public class DestinationsController : ControllerBase
{
    private readonly IDestinationService _destinationService;

    public DestinationsController(IDestinationService destinationService)
    {
        _destinationService = destinationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var destinations = await _destinationService.GetDestinationsAsync(cancellationToken);

        return Ok(destinations);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var destination = await _destinationService.GetDestinationAsync(id, cancellationToken);

        return destination is null ? NotFound() : Ok(destination);
    }

    [HttpPost("recommendations")]
    public async Task<IActionResult> GetRecommendations([FromBody] DestinationRecommendationRequest request, CancellationToken cancellationToken)
    {
        var recommendations = await _destinationService.GetRecommendationsAsync(request, cancellationToken);

        return Ok(recommendations);
    }
}
