import type { CSSProperties } from "react";
import type { ReviewPacket } from "@/core/model";

export function EvidencePreview({ packet }: { packet: ReviewPacket }) {
  const evidence = packet.evidence;

  if (packet.imageUrl) {
    return <img className="evidence-image" src={packet.imageUrl} alt={`Uploaded label for ${packet.fileName}`} />;
  }

  return (
    <section className="evidence-preview" style={{ "--paper-accent": "#476f95" } as CSSProperties}>
      <p>Label evidence</p>
      <h3>{evidence?.brand || packet.application.brand || "No brand detected"}</h3>
      <span>{evidence?.productClass || packet.application.productClass || "Class/type not detected"}</span>
      <strong>
        {[evidence?.alcohol || packet.application.alcohol, evidence?.proof, evidence?.volume || packet.application.volume]
          .filter(Boolean)
          .join("  /  ")}
      </strong>
      <small>{evidence?.producer || packet.application.producer}</small>
      <blockquote>{evidence?.warning || "Warning evidence will appear after extraction."}</blockquote>
    </section>
  );
}
