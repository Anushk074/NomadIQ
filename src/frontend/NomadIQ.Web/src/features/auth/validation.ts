// Mirrors the DataAnnotations on IdentityService's RegisterRequest/LoginRequest
// exactly, so the frontend rejects the same inputs the backend would.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Email is required.";
  }

  if (trimmed.length > 256) {
    return "Email must be 256 characters or fewer.";
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address.";
  }

  return undefined;
}

// LoginRequest.Password only has [Required] - no length rule - so login
// must accept whatever password a previously-registered account was created
// with, even under looser rules in the future.
export function validateLoginPassword(value: string): string | undefined {
  return value ? undefined : "Password is required.";
}

// RegisterRequest.Password has [Required, MinLength(8), StringLength(128)].
export function validateRegistrationPassword(value: string): string | undefined {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (value.length > 128) {
    return "Password must be 128 characters or fewer.";
  }

  return undefined;
}

// RegisterRequest.FirstName/LastName both have [Required, StringLength(100)].
export function validateName(value: string, fieldLabel: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${fieldLabel} is required.`;
  }

  if (trimmed.length > 100) {
    return `${fieldLabel} must be 100 characters or fewer.`;
  }

  return undefined;
}
