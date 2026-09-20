import { useState } from "react";
import { deleteDay } from "../../api/tripsApi";
import { useMutation } from "../../hooks/useMutation";

// Deleting a day cascade-deletes its activities on the backend, so the
// confirmation copy says so explicitly rather than just "Delete this day?".
export function DeleteDayAction({
  tripId,
  dayId,
  dayNumber,
  onDeleted,
}: {
  tripId: string;
  dayId: string;
  dayNumber: number;
  onDeleted: () => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { isSubmitting, error, mutate } = useMutation(deleteDay);

  async function handleConfirm() {
    const result = await mutate(tripId, dayId);
    if (result.ok) {
      onDeleted();
    }
  }

  if (!isConfirming) {
    return (
      <button type="button" className="btn btn-danger btn-small" onClick={() => setIsConfirming(true)}>
        Delete day
      </button>
    );
  }

  return (
    <div className="confirm-delete" role="alert">
      <p>Delete Day {dayNumber}? All activities planned for this day will also be deleted.</p>
      {error && <p className="form-error">{error}</p>}
      <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={isSubmitting}>
        {isSubmitting ? "Deleting…" : "Yes, delete day"}
      </button>
      <button type="button" className="btn" onClick={() => setIsConfirming(false)} disabled={isSubmitting}>
        Cancel
      </button>
    </div>
  );
}
