import { OUTCOME_TEXT } from "@/core/standards";
import type { Outcome, ReviewPacket } from "@/core/model";
import { OutcomeBadge, toneClass } from "./OutcomeBadge";

const laneText: Record<Outcome, string> = {
  problem: "Correct before moving forward",
  check: "Agent should confirm",
  incomplete: "Application packet needs data",
  clear: "No automated concerns"
};

type TriageLanesProps = {
  packets: ReviewPacket[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function TriageLanes({ packets, selectedId, onSelect }: TriageLanesProps) {
  const grouped = (["problem", "check", "incomplete", "clear"] as Outcome[]).map((outcome) => ({
    outcome,
    packets: packets.filter((packet) => packet.report?.outcome === outcome)
  }));

  return (
    <section className="triage-lanes" aria-label="Batch priority lanes">
      {grouped.map(({ outcome, packets: lanePackets }) => (
        <article className={`lane ${toneClass(outcome)}`} key={outcome}>
          <header>
            <div>
              <h2>{OUTCOME_TEXT[outcome]}</h2>
              <p>{laneText[outcome]}</p>
            </div>
            <strong>{lanePackets.length}</strong>
          </header>
          <div className="lane-stack">
            {lanePackets.map((packet) => (
              <button
                type="button"
                className={packet.id === selectedId ? "packet-card selected" : "packet-card"}
                onClick={() => onSelect(packet.id)}
                key={packet.id}
              >
                <span>{packet.application.id}</span>
                <strong>{packet.application.brand || packet.fileName}</strong>
                <small>{packet.report?.headline || "Ready for review"}</small>
                <OutcomeBadge outcome={packet.report?.outcome} />
              </button>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
