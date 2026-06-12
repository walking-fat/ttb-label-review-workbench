import { ClipboardList, FileText, Info } from "lucide-react";
import { useState } from "react";
import type { Finding, Outcome, ReviewPacket } from "@/core/model";
import { OUTCOME_TEXT } from "@/core/standards";
import { OutcomeIcon, toneClass } from "./OutcomeBadge";

const order: Outcome[] = ["problem", "check", "incomplete", "clear"];

function sortFindings(findings: Finding[]) {
  const rank: Record<Outcome, number> = { problem: 4, check: 3, incomplete: 2, clear: 1 };
  return [...findings].sort((a, b) => rank[b.outcome] - rank[a.outcome]);
}

export function FindingsPanel({ packet }: { packet: ReviewPacket }) {
  const [view, setView] = useState<"checks" | "text" | "method">("checks");
  const findings = sortFindings(packet.report?.findings ?? []);

  return (
    <section className="findings-panel">
      <nav className="panel-tabs" aria-label="Case details">
        <button type="button" className={view === "checks" ? "active" : ""} onClick={() => setView("checks")}>
          <ClipboardList aria-hidden="true" />
          Field checks
        </button>
        <button type="button" className={view === "text" ? "active" : ""} onClick={() => setView("text")}>
          <FileText aria-hidden="true" />
          Extracted text
        </button>
        <button type="button" className={view === "method" ? "active" : ""} onClick={() => setView("method")}>
          <Info aria-hidden="true" />
          Method
        </button>
      </nav>

      {view === "checks" && (
        <div className="finding-sections">
          {findings.length === 0 && <p className="empty-copy">Run verification to generate field-level findings.</p>}
          {order.map((outcome) => {
            const group = findings.filter((finding) => finding.outcome === outcome);
            if (group.length === 0) return null;
            return (
              <section className={`finding-section ${toneClass(outcome)}`} key={outcome}>
                <h3>
                  <OutcomeIcon outcome={outcome} />
                  {OUTCOME_TEXT[outcome]}
                </h3>
                {group.map((finding) => (
                  <article className="finding-card" key={finding.key}>
                    <header>
                      <strong>{finding.name}</strong>
                      <em>{finding.confidence}% confidence</em>
                    </header>
                    <div className="compare-box">
                      <p>
                        <span>Application says</span>
                        {finding.expected || "Not provided"}
                      </p>
                      <p>
                        <span>Label evidence says</span>
                        {finding.observed || "Not found"}
                      </p>
                    </div>
                    <p>{finding.explanation}</p>
                    <footer>{finding.agentAction}</footer>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      )}

      {view === "text" && <pre className="transcript">{packet.evidence?.transcript || "No extracted text available."}</pre>}

      {view === "method" && (
        <div className="method-notes">
          <article>
            <h3>Evidence first</h3>
            <p>The model reads the label and returns structured facts. It does not decide whether the label passes.</p>
          </article>
          <article>
            <h3>Rules decide the routing</h3>
            <p>Numeric values, warning text, and tolerant text comparisons run in TypeScript so behavior is testable.</p>
          </article>
          <article>
            <h3>Agent remains final reviewer</h3>
            <p>Every result includes an action so the reviewer can decide whether to approve, correct, or hold the item.</p>
          </article>
        </div>
      )}
    </section>
  );
}
