using IdentityService.Application.Abstractions;
using IdentityService.Application.Common;
using IdentityService.Application.Dtos;
using IdentityService.Domain.Entities;
using IdentityService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IdentityDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IdentityDbContext dbContext,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var emailAlreadyRegistered = await _dbContext.Users
            .AnyAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (emailAlreadyRegistered)
        {
            return AuthResult.Failure("Email is already registered.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return AuthResult.Success(BuildAuthResponse(user));
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .SingleOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (user is null || !_passwordHasher.VerifyPassword(user.PasswordHash, request.Password))
        {
            return AuthResult.Failure("Invalid email or password.");
        }

        return AuthResult.Success(BuildAuthResponse(user));
    }

    private AuthResponseDto BuildAuthResponse(User user)
    {
        var (token, expiresAt) = _jwtTokenGenerator.GenerateToken(user);

        return new AuthResponseDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            token,
            expiresAt);
    }
}
