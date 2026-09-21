import { aiApiClient } from "../../../api/aiApi";
import { authorizationHeader } from "../../auth/tokenStorage";
import type { ConversationMessage, SendMessageResponse } from "../types";

// AIService is the only service the frontend calls for assistant messages.
// It orchestrates any trip change itself; the frontend never mutates the
// trip. The user is identified by the JWT alone - no user id is sent.

export function getMessages(tripId: string): Promise<ConversationMessage[]> {
  return aiApiClient.get<ConversationMessage[]>(`api/ai/trips/${tripId}/messages`, {
    headers: authorizationHeader(),
  });
}

export function sendMessage(tripId: string, message: string): Promise<SendMessageResponse> {
  return aiApiClient.post<SendMessageResponse>(
    `api/ai/trips/${tripId}/messages`,
    { message },
    { headers: authorizationHeader() },
  );
}
