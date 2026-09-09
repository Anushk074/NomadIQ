namespace IdentityService.Application.Dtos;

public record AuthResponseDto(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string AccessToken,
    DateTime ExpiresAt
);
