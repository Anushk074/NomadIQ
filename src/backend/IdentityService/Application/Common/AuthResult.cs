using IdentityService.Application.Dtos;

namespace IdentityService.Application.Common;

public sealed class AuthResult
{
    public bool Succeeded { get; }
    public string? Error { get; }
    public AuthResponseDto? Data { get; }

    private AuthResult(bool succeeded, string? error, AuthResponseDto? data)
    {
        Succeeded = succeeded;
        Error = error;
        Data = data;
    }

    public static AuthResult Success(AuthResponseDto data) => new(true, null, data);

    public static AuthResult Failure(string error) => new(false, error, null);
}
