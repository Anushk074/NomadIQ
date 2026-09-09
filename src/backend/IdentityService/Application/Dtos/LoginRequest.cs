using System.ComponentModel.DataAnnotations;

namespace IdentityService.Application.Dtos;

public record LoginRequest(
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required] string Password
);
