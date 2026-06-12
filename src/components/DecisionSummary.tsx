import type { ReviewReport } from "@/core/model";
import { OutcomeBadge, OutcomeIcon, toneClass } from "./OutcomeBadge";

export function DecisionSummary({ report }: { report?: ReviewReport }) {
  if (!report) {
    return (
      <section className="decision-summary tone-incomplete" aria-live="polite">
        <div className="decision-symbol">
          <OutcomeIcon />
        </div>
        <div>
          <OutcomeBadge />
          <h2>Review has not run yet</h2>
          <p>Confirm the application packet and run the case to generate field-level findings.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`decision-summary ${toneClass(report.outcome)}`} aria-live="polite">
      <div className="decision-symbol">
        <OutcomeIcon outcome={report.outcome} />
      </div>
      <div>
        <OutcomeBadge outcome={report.outcome} />
        <h2>{report.headline}</h2>
        <p>{report.recommendation}</p>
        <dl>
          <div>
            <dt>Problems</dt>
            <dd>{report.counts.problem}</dd>
          </div>
          <div>
            <dt>Checks</dt>
            <dd>{report.counts.check}</dd>
          </div>
          <div>
            <dt>Cleared</dt>
            <dd>{report.counts.clear}</dd>
          </div>
          <div>
            <dt>Elapsed</dt>
            <dd>{report.elapsedMs} ms</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
