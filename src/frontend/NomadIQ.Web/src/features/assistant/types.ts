// Mirrors AIService's actual assistant DTOs exactly
// (src/backend/AIService/Application/Dtos/SendMessageRequest.cs and SendMessageResponse.cs).

// Mirrors SendMessageRequest: Message is required, 1-2000 characters.
export interface SendMessageRequest {
  message: string;
}

// Mirrors SendMessageResponse. `actionExecuted` is the only signal that the
// assistant changed the trip - it is never inferred from `reply` text. The
// reply itself is AI-authored text (the backend appends a short outcome note
// when an action was attempted) and is not authoritative trip data.
export interface SendMessageResponse {
  reply: string;
  actionExecuted: boolean;
}

// Mirrors ConversationMessageResponse. `role` is serialized as a string;
// `createdAt` is a UTC ISO 8601 date-time. History carries no per-message
// "action executed" flag.
export type MessageRole = "User" | "Assistant";

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}
