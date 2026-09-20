// Display helpers for discovery data. The INR-first convention is a
// product decision - the DiscoveryService contract has no currency field.

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const budgetFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? String(month);
}

export const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({ value: index + 1, label: name }));

// bestTravelMonths arrive in seed order (e.g. [10,11,12,1,2,3]); sort
// chronologically for display.
export function formatBestMonths(months: number[]): string {
  return [...months]
    .sort((a, b) => a - b)
    .map(monthName)
    .join(", ");
}

export function formatPerDayBudget(averageBudget: number): string {
  return `${budgetFormatter.format(averageBudget)}/day`;
}

// The 100-point scale comes from the current backend scoring weights
// (40 budget + 40 tags + 20 season); it is not exposed by the API itself.
export function formatScore(score: number): string {
  return `${score} / 100`;
}

// Distinct, case-insensitively de-duplicated tags across the catalog, used
// as suggestions (there is no tags endpoint).
export function collectTags(tagLists: string[][]): string[] {
  const seen = new Map<string, string>();

  for (const tag of tagLists.flat()) {
    const key = tag.trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.set(key, tag.trim());
    }
  }

  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
