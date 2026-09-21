export function formatMessageTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

// "09:00:00" -> "09:00"
export function formatActivityTime(time: string | null): string | null {
  return time ? time.slice(0, 5) : null;
}
