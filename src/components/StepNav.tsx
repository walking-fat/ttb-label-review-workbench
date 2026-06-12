export type ReviewStep = "intake" | "application" | "verify" | "results";

const steps: { id: ReviewStep; title: string; helper: string }[] = [
  { id: "intake", title: "Choose labels", helper: "Upload or try demos" },
  { id: "application", title: "Confirm data", helper: "Review expected fields" },
  { id: "verify", title: "Run checks", helper: "Extract and compare" },
  { id: "results", title: "Review packet", helper: "Act on findings" }
];

type StepNavProps = {
  activeStep: ReviewStep;
  onStepChange: (step: ReviewStep) => void;
};

export function StepNav({ activeStep, onStepChange }: StepNavProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <nav className="step-nav" aria-label="Review workflow">
      {steps.map((step, index) => (
        <button
          type="button"
          key={step.id}
          className={step.id === activeStep ? "active" : index < activeIndex ? "complete" : ""}
          onClick={() => onStepChange(step.id)}
          aria-current={step.id === activeStep ? "step" : undefined}
        >
          <span>{index + 1}</span>
          <strong>{step.title}</strong>
          <small>{step.helper}</small>
        </button>
      ))}
    </nav>
  );
}
