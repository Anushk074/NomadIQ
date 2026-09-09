using IdentityService.Domain.Entities;

namespace IdentityService.Application.Abstractions;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}
