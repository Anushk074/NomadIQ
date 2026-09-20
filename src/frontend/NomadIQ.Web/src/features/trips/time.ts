// Converts between the "HH:mm:ss" .NET TimeOnly format TripService
// returns/expects and the "HH:mm" format native <input type="time"> uses.

export function timeToInputValue(value: string | null): string {
  return value ? value.slice(0, 5) : "";
}

export function inputValueToTime(value: string): string | null {
  return value ? `${value}:00` : null;
}
