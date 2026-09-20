// Display helpers for generated plans. The AI's `currency` is unvalidated
// model output, so a bad code must degrade to "12,000 XYZ", never throw or
// silently drop the code.

const inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// The user's own requested budget - the form is labelled in INR (₹).
export function formatRequestedBudget(amount: number): string {
  return inrFormatter.format(amount);
}

// An amount in the currency the AI reported.
export function formatPlanMoney(amount: number, currency: string): string {
  const code = currency.trim();

  if (code) {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(
        amount,
      );
    } catch {
      return `${amount.toLocaleString("en-IN")} ${code}`;
    }
  }

  return amount.toLocaleString("en-IN");
}
