import { useEffect, useRef } from "react";
import type { TransientExchange } from "../hooks/useConversation";
import type { ConversationMessage } from "../types";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  messages,
  pendingText,
  transient,
}: {
  messages: ConversationMessage[];
  pendingText: string | null;
  transient: TransientExchange | null;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, pendingText, transient]);

  return (
    <div className="chat-messages" aria-live="polite">
      {messages.length === 0 && !pendingText && !transient && (
        <div className="chat-empty">
          <p>No messages yet for this trip.</p>
          <p className="eyebrow">
            Ask a question about the trip, or ask the assistant to update the budget, change the status, or add,
            change or remove an activity on an existing day. It can't add or remove days, or change dates or the
            destination.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} role={message.role} content={message.content} createdAt={message.createdAt} />
      ))}

      {pendingText && <MessageBubble role="User" content={pendingText} note="Sending…" />}

      {transient && (
        <>
          <MessageBubble role="User" content={transient.userText} />
          <MessageBubble role="Assistant" content={transient.reply} note="Not yet reloaded" />
        </>
      )}

      <div ref={endRef} />
    </div>
  );
}
