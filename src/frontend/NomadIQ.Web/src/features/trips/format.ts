// Shared display formatting for trip data - used by TripSummaryCard and
// TripDetailsCard so both surfaces render dates/budgets identically.

const dateFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" });
const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatTripDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

export function formatTripBudget(amount: number, currency: string): string {
  let formatter = currencyFormatters.get(currency);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 });
    } catch {
      // Defensive fallback in case `currency` isn't a code Intl recognizes.
      formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
    }
    currencyFormatters.set(currency, formatter);
  }

  return formatter.format(amount);
}
