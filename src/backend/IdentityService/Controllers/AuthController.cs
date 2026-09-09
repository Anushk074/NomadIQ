using System.IdentityModel.Tokens.Jwt;
using IdentityService.Application.Abstractions;
using IdentityService.Application.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.RegisterAsync(request, cancellationToken);

        if (!result.Succeeded)
        {
            return Conflict(new { message = result.Error });
        }

        return Ok(result.Data);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request, cancellationToken);

        if (!result.Succeeded)
        {
            return Unauthorized(new { message = result.Error });
        }

        return Ok(result.Data);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId) || string.IsNullOrEmpty(email))
        {
            return Unauthorized();
        }

        return Ok(new CurrentUserResponse(userId, email));
    }
}
