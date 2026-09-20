import { useState } from "react";
import { GeneratedPlan } from "../components/GeneratedPlan";
import { PlannerForm } from "../components/PlannerForm";
import { PlannerErrorState, PlannerLoadingState } from "../components/PlannerStates";
import { useTripPlanner } from "../hooks/useTripPlanner";
import { INITIAL_PLANNER_VALUES } from "../validation";
import type { PlannerFormValues } from "../validation";

export function PlannerPage() {
  const planner = useTripPlanner();
  const [values, setValues] = useState<PlannerFormValues>(INITIAL_PLANNER_VALUES);

  function handleChange<K extends keyof PlannerFormValues>(field: K, value: PlannerFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleGenerateAnother() {
    setValues(INITIAL_PLANNER_VALUES);
    planner.reset();
  }

  const { state } = planner;

  return (
    <section>
      <div className="page-header">
        <h1>AI Trip Planner</h1>
      </div>

      {state.status === "success" ? (
        <GeneratedPlan
          plan={state.plan}
          request={state.request}
          onChangeRequest={planner.reset}
          onGenerateAnother={handleGenerateAnother}
        />
      ) : (
        <>
          <p className="eyebrow">
            Describe your trip and AI will draft a day-by-day plan. The result is a preview and is not saved to your
            trips.
          </p>

          <PlannerForm
            values={values}
            onChange={handleChange}
            isSubmitting={state.status === "loading"}
            onSubmit={(request) => void planner.generate(request)}
          />

          {state.status === "loading" && <PlannerLoadingState />}
          {state.status === "error" && <PlannerErrorState message={state.message} onRetry={planner.retry} />}
        </>
      )}
    </section>
  );
}
