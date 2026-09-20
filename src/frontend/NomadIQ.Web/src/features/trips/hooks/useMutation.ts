import { useCallback, useState } from "react";
import { ApiError } from "../../../api/httpClient";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";

export type MutationResult<TResult> = { ok: true; data: TResult } | { ok: false };

// A small shared wrapper for "call this API function, track submitting/error,
// route 401s through the existing auth handling" - used by every day/activity
// create/update/delete action so each doesn't reimplement this by hand.
// Returns a discriminated result rather than `TResult | undefined` because a
// successful delete legitimately resolves to `undefined` too.
export function useMutation<TArgs extends unknown[], TResult>(mutationFn: (...args: TArgs) => Promise<TResult>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleUnauthorized = useHandleUnauthorized();

  const mutate = useCallback(
    async (...args: TArgs): Promise<MutationResult<TResult>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const data = await mutationFn(...args);
        setIsSubmitting(false);
        return { ok: true, data };
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return { ok: false };
        }

        // Never surface a raw error/exception message - only the typed,
        // backend-provided message (via ApiError, which already covers
        // 400/404/409) or a generic fallback.
        setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return { ok: false };
      }
    },
    // mutationFn is expected to be a stable module-level tripsApi function.
    [mutationFn, handleUnauthorized],
  );

  return { isSubmitting, error, mutate };
}
