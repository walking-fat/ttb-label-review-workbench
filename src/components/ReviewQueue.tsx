import { FileText } from "lucide-react";
import type { ReviewPacket } from "@/core/model";
import { OutcomeBadge } from "./OutcomeBadge";

type ReviewQueueProps = {
  packets: ReviewPacket[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ReviewQueue({ packets, selectedId, onSelect }: ReviewQueueProps) {
  return (
    <section className="queue-panel" aria-label="Review queue">
      <header>
        <div>
          <p className="kicker">Review queue</p>
          <h2>{packets.length} label packet{packets.length === 1 ? "" : "s"} ready</h2>
        </div>
        <span>Confirm data before running checks.</span>
      </header>
      <div className="queue-list">
        {packets.map((packet) => (
          <button
            type="button"
            className={packet.id === selectedId ? "queue-item selected" : "queue-item"}
            onClick={() => onSelect(packet.id)}
            key={packet.id}
          >
            <FileText aria-hidden="true" />
            <span>
              <strong>{packet.application.brand || packet.fileName}</strong>
              <small>{packet.application.id} / {packet.fileName}</small>
            </span>
            <OutcomeBadge outcome={packet.report?.outcome} />
          </button>
        ))}
      </div>
    </section>
  );
}
