using IdentityService.Application.Abstractions;
using IdentityService.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    private readonly Microsoft.AspNetCore.Identity.PasswordHasher<User> _identityPasswordHasher = new();

    public string HashPassword(string password)
    {
        return _identityPasswordHasher.HashPassword(user: null!, password);
    }

    public bool VerifyPassword(string passwordHash, string providedPassword)
    {
        var result = _identityPasswordHasher.VerifyHashedPassword(user: null!, passwordHash, providedPassword);

        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
