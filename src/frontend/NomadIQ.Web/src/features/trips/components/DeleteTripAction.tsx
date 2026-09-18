import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../api/httpClient";
import { paths } from "../../../routes/paths";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { deleteTrip } from "../api/tripsApi";

// Requires an explicit second click ("Yes, delete") before anything is
// deleted - no silent/single-click deletion.
export function DeleteTripAction({ tripId }: { tripId: string }) {
  const navigate = useNavigate();
  const handleUnauthorized = useHandleUnauthorized();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteTrip(tripId);
      // Navigating to /trips remounts that page, which refetches the list -
      // no separate "refresh" step is needed.
      navigate(paths.trips, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  if (!isConfirming) {
    return (
      <button type="button" className="btn btn-danger" onClick={() => setIsConfirming(true)}>
        Delete trip
      </button>
    );
  }

  return (
    <div className="confirm-delete" role="alert">
      <p>Delete this trip? This can't be undone.</p>
      {error && <p className="form-error">{error}</p>}
      <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting…" : "Yes, delete"}
      </button>
      <button type="button" className="btn" onClick={() => setIsConfirming(false)} disabled={isDeleting}>
        Cancel
      </button>
    </div>
  );
}
