import { useState } from "react";
import { deleteActivity } from "../../api/tripsApi";
import { useMutation } from "../../hooks/useMutation";

export function DeleteActivityAction({
  tripId,
  dayId,
  activityId,
  onDeleted,
}: {
  tripId: string;
  dayId: string;
  activityId: string;
  onDeleted: () => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { isSubmitting, error, mutate } = useMutation(deleteActivity);

  async function handleConfirm() {
    const result = await mutate(tripId, dayId, activityId);
    if (result.ok) {
      onDeleted();
    }
  }

  if (!isConfirming) {
    return (
      <button type="button" className="btn btn-danger btn-small" onClick={() => setIsConfirming(true)}>
        Delete
      </button>
    );
  }

  return (
    <div className="confirm-delete" role="alert">
      <p>Delete this activity?</p>
      {error && <p className="form-error">{error}</p>}
      <button type="button" className="btn btn-danger" onClick={handleConfirm} disabled={isSubmitting}>
        {isSubmitting ? "Deleting…" : "Yes, delete"}
      </button>
      <button type="button" className="btn" onClick={() => setIsConfirming(false)} disabled={isSubmitting}>
        Cancel
      </button>
    </div>
  );
}
