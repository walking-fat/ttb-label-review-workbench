import type { ApplicationPacket } from "@/core/model";

const fields: { key: keyof ApplicationPacket; label: string; placeholder?: string; multiline?: boolean }[] = [
  { key: "id", label: "Application ID" },
  { key: "brand", label: "Brand", placeholder: "OLD TOM DISTILLERY" },
  { key: "productClass", label: "Class/type", placeholder: "Kentucky Straight Bourbon Whiskey" },
  { key: "alcohol", label: "Alcohol statement", placeholder: "45% Alc./Vol. (90 Proof)" },
  { key: "volume", label: "Net contents", placeholder: "750 mL" },
  { key: "producer", label: "Producer/bottler", placeholder: "Bottled by Old Tom Distillery", multiline: true },
  { key: "origin", label: "Country of origin", placeholder: "Product of Scotland" },
  { key: "importer", label: "Importer", placeholder: "Required for imports", multiline: true }
];

type ApplicationEditorProps = {
  application: ApplicationPacket;
  score?: number;
  onChange: (field: keyof ApplicationPacket, value: string) => void;
};

export function ApplicationEditor({ application, score, onChange }: ApplicationEditorProps) {
  return (
    <aside className="application-editor" aria-label="Application packet fields">
      <header>
        <div>
          <p className="kicker">Application packet</p>
          <h2>Expected label facts</h2>
        </div>
        <strong>{score ?? "--"}%</strong>
      </header>
      <div className="field-list">
        {fields.map((field) => (
          <label key={field.key}>
            <span>{field.label}</span>
            {field.multiline ? (
              <textarea
                rows={3}
                value={String(application[field.key] ?? "")}
                placeholder={field.placeholder}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            ) : (
              <input
                value={String(application[field.key] ?? "")}
                placeholder={field.placeholder}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            )}
          </label>
        ))}
      </div>
    </aside>
  );
}
