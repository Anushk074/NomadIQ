using IdentityService.Application.Common;
using IdentityService.Application.Dtos;

namespace IdentityService.Application.Abstractions;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
