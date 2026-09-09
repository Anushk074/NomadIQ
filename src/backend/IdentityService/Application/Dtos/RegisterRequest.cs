using System.ComponentModel.DataAnnotations;

namespace IdentityService.Application.Dtos;

public record RegisterRequest(
    [Required, StringLength(100)] string FirstName,
    [Required, StringLength(100)] string LastName,
    [Required, EmailAddress, StringLength(256)] string Email,
    [Required, MinLength(8), StringLength(128)] string Password
);
