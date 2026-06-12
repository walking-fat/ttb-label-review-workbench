import { AlertTriangle, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { OUTCOME_TEXT } from "@/core/standards";
import type { Outcome } from "@/core/model";

export function toneClass(outcome?: Outcome) {
  return outcome ? `tone-${outcome}` : "tone-incomplete";
}

export function OutcomeIcon({ outcome }: { outcome?: Outcome }) {
  if (outcome === "clear") return <CheckCircle2 aria-hidden="true" />;
  if (outcome === "problem") return <XCircle aria-hidden="true" />;
  if (outcome === "check") return <AlertTriangle aria-hidden="true" />;
  return <CircleHelp aria-hidden="true" />;
}

export function OutcomeBadge({ outcome }: { outcome?: Outcome }) {
  return (
    <span className={`outcome-badge ${toneClass(outcome)}`}>
      <OutcomeIcon outcome={outcome} />
      {outcome ? OUTCOME_TEXT[outcome] : "Pending"}
    </span>
  );
}
