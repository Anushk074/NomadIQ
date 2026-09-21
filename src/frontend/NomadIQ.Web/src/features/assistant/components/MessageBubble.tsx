import { formatMessageTime } from "../format";
import type { MessageRole } from "../types";

// Content is rendered as plain text (React escapes it; pre-wrap keeps the
// line breaks). AI output is never interpreted as HTML.
export function MessageBubble({
  role,
  content,
  createdAt,
  note,
}: {
  role: MessageRole;
  content: string;
  createdAt?: string;
  note?: string;
}) {
  const isUser = role === "User";

  return (
    <div className={isUser ? "message message-user" : "message message-assistant"}>
      <div className="message-meta">
        <span>{isUser ? "You" : "AI assistant"}</span>
        {createdAt && <span>{formatMessageTime(createdAt)}</span>}
        {note && <span>{note}</span>}
      </div>
      <p className="message-content">{content}</p>
    </div>
  );
}
