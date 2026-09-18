import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../api/httpClient";
import { paths } from "../../../routes/paths";
import { useHandleUnauthorized } from "../../auth/useHandleUnauthorized";
import { createTrip } from "../api/tripsApi";
import { TripFieldsFieldset } from "../components/TripFieldsFieldset";
import { hasFormErrors, validateTripForm } from "../validation";
import type { TripFormErrors, TripFormValues } from "../validation";

const initialValues: TripFormValues = {
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  currency: "INR",
  travelStyle: "",
};

export function NewTripPage() {
  const navigate = useNavigate();
  const handleUnauthorized = useHandleUnauthorized();

  const [values, setValues] = useState<TripFormValues>(initialValues);
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange<K extends keyof TripFormValues>(field: K, value: TripFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateTripForm(values);
    setErrors(nextErrors);
    setFormError(null);

    if (hasFormErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const trip = await createTrip({
        destination: values.destination.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        budget: Number(values.budget),
        currency: values.currency.trim().toUpperCase(),
        travelStyle: values.travelStyle.trim(),
      });

      // The trip now exists on the server - show it, not a fake local copy.
      navigate(paths.tripDetails(trip.id), { replace: true, state: { created: true } });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
        return;
      }

      setFormError(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Create a trip</h1>
      <form onSubmit={handleSubmit} noValidate>
        <TripFieldsFieldset values={values} errors={errors} onChange={handleChange} />

        {formError && <p role="alert">{formError}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create trip"}
          </button>
        </div>
      </form>
    </section>
  );
}
