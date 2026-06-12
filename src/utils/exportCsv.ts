import { OUTCOME_TEXT } from "@/core/standards";
import type { ReviewPacket } from "@/core/model";

function csvCell(value: string | number | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function exportReviewCsv(packets: ReviewPacket[]) {
  const rows = [
    ["Application ID", "File", "Outcome", "Score", "Problems", "Checks", "Incomplete", "Recommendation"].join(","),
    ...packets.map((packet) => {
      const report = packet.report;
      return [
        csvCell(packet.application.id),
        csvCell(packet.fileName),
        csvCell(report ? OUTCOME_TEXT[report.outcome] : "Not run"),
        csvCell(report?.score),
        csvCell(report?.counts.problem),
        csvCell(report?.counts.check),
        csvCell(report?.counts.incomplete),
        csvCell(report?.recommendation)
      ].join(",");
    })
  ].join("\n");

  const blob = new Blob([rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "label-triage-brief.csv";
  link.click();
  URL.revokeObjectURL(url);
}
