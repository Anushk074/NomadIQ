import { useState } from "react";
import type { FormEvent } from "react";
import { MAX_MESSAGE_LENGTH, validateMessage } from "../validation";

// The draft is only cleared after a successful send, so a failed send
// leaves the text in place for the user to retry deliberately.
export function MessageComposer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const validation = validateMessage(draft);
    setError(validation);

    if (validation) {
      return;
    }

    const ok = await onSend(draft.trim());

    if (ok) {
      setDraft("");
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <label htmlFor="assistant-message" className="visually-hidden">
        Message
      </label>
      <textarea
        id="assistant-message"
        placeholder="Ask about this trip…"
        value={draft}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
      />
      <div className="composer-footer">
        <span className="eyebrow">
          {draft.trim().length}/{MAX_MESSAGE_LENGTH}
        </span>
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          {disabled ? "Waiting for reply…" : "Send"}
        </button>
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
    </form>
  );
}
