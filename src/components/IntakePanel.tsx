import { Download, Files, Loader2, Play, RotateCcw, Upload } from "lucide-react";

type IntakePanelProps = {
  isBusy: boolean;
  queueCount: number;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSamples: () => void;
  onRunQueue: () => void;
  onExport: () => void;
  onResetSamples: () => void;
};

export function IntakePanel({ isBusy, queueCount, onUpload, onLoadSamples, onRunQueue, onExport, onResetSamples }: IntakePanelProps) {
  return (
    <section className="intake-panel" aria-label="Review setup">
      <header>
        <p className="kicker">Start here</p>
        <h2>Start a label review queue</h2>
        <p>Add label artwork or load demo cases. Each queue moves through application data, verification, and findings.</p>
      </header>
      <div className="intake-choices">
        <label className="choice-card upload-choice">
          <Upload aria-hidden="true" />
          <span>
            <strong>Add label images</strong>
            <small>Upload one or many SVG, PNG, or JPG files.</small>
          </span>
          <input className="sr-only" type="file" accept="image/*" multiple onChange={onUpload} />
        </label>
        <button type="button" className="choice-card" onClick={onLoadSamples}>
          <Files aria-hidden="true" />
          <span>
            <strong className="choice-heading">
              <span>Try demo cases</span>
              <em>Evaluation mode</em>
            </strong>
            <small>Loads synthetic cases for reviewers to test the prototype without production records.</small>
          </span>
        </button>
      </div>
      {queueCount > 0 && (
        <div className="intake-actions">
          <button type="button" onClick={onRunQueue} disabled={isBusy}>
            {isBusy ? <Loader2 className="spin" aria-hidden="true" /> : <Play aria-hidden="true" />}
            Run queue
          </button>
          <button type="button" onClick={onExport}>
            <Download aria-hidden="true" />
            Export CSV
          </button>
          <button type="button" onClick={onResetSamples}>
            <RotateCcw aria-hidden="true" />
            Reset demo cases
          </button>
        </div>
      )}
    </section>
  );
}
