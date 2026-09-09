namespace IdentityService.Application.Dtos;

public record CurrentUserResponse(Guid UserId, string Email);
