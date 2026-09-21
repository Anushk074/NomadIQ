export const MAX_MESSAGE_LENGTH = 2000;

// Mirrors SendMessageRequest's [Required, StringLength(2000, MinimumLength = 1)].
// [Required] also rejects whitespace-only strings (verified against the
// running service), so blank input is rejected here too.
export function validateMessage(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Enter a message to send.";
  }

  return trimmed.length > MAX_MESSAGE_LENGTH ? `Messages can be at most ${MAX_MESSAGE_LENGTH} characters.` : undefined;
}
