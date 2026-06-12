"use client";

import { ArrowLeft, ArrowRight, Loader2, SearchCheck } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { ApplicationEditor } from "@/components/ApplicationEditor";
import { DecisionSummary } from "@/components/DecisionSummary";
import { EvidencePreview } from "@/components/EvidencePreview";
import { FindingsPanel } from "@/components/FindingsPanel";
import { GovShell } from "@/components/GovShell";
import { IntakePanel } from "@/components/IntakePanel";
import { ReviewQueue } from "@/components/ReviewQueue";
import { StepNav, type ReviewStep } from "@/components/StepNav";
import { TriageLanes } from "@/components/TriageLanes";
import { OutcomeBadge } from "@/components/OutcomeBadge";
import type { ApplicationPacket, ReviewPacket, ReviewReport } from "@/core/model";
import { createReadySamplePackets, createUploadPacket } from "@/fixtures/reviewPackets";
import { exportReviewCsv } from "@/utils/exportCsv";

const stepOrder: ReviewStep[] = ["intake", "application", "verify", "results"];

function nextStep(step: ReviewStep) {
  return stepOrder[Math.min(stepOrder.indexOf(step) + 1, stepOrder.length - 1)];
}

function previousStep(step: ReviewStep) {
  return stepOrder[Math.max(stepOrder.indexOf(step) - 1, 0)];
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(new Error(`Could not read ${file.name}.`)));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [packets, setPackets] = useState<ReviewPacket[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeStep, setActiveStep] = useState<ReviewStep>("intake");
  const [isBusy, setIsBusy] = useState(false);

  const selected = useMemo(() => packets.find((packet) => packet.id === selectedId) ?? packets[0], [packets, selectedId]);
  const hasQueue = packets.length > 0;
  const hasReports = packets.some((packet) => packet.report);

  function replacePacket(updated: ReviewPacket) {
    setPackets((current) => current.map((packet) => (packet.id === updated.id ? updated : packet)));
  }

  function updateApplication(field: keyof ApplicationPacket, value: string) {
    if (!selected) return;
    replacePacket({
      ...selected,
      report: undefined,
      application: {
        ...selected.application,
        [field]: value
      }
    });
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;

    const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
    const uploads = files.map((file, index) => createUploadPacket(file, index, dataUrls[index]));
    setPackets(uploads);
    setSelectedId(uploads[0].id);
    setActiveStep("application");
  }

  async function runPacket(packet: ReviewPacket) {
    replacePacket({ ...packet, state: "running", error: undefined });

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: packet.application,
          fileName: packet.fileName,
          imageDataUrl: packet.imageDataUrl,
          forceSample: !packet.imageUrl
        })
      });

      if (!response.ok) {
        throw new Error("Review request failed.");
      }

      const payload = (await response.json()) as { report: ReviewReport };
      replacePacket({
        ...packet,
        state: "done",
        evidence: payload.report.evidence,
        report: payload.report
      });
    } catch (error) {
      replacePacket({
        ...packet,
        state: "failed",
        error: error instanceof Error ? error.message : "Review failed."
      });
    }
  }

  async function runSelected() {
    if (!selected) return;
    setIsBusy(true);
    await runPacket(selected);
    setIsBusy(false);
    setActiveStep("results");
  }

  async function runQueue() {
    if (!packets.length) return;
    setIsBusy(true);
    for (const packet of packets) {
      await runPacket(packet);
    }
    setIsBusy(false);
    setActiveStep("results");
  }

  function loadSamples() {
    const samples = createReadySamplePackets();
    setPackets(samples);
    setSelectedId(samples[0].id);
    setActiveStep("application");
  }

  function resetSamples() {
    const samples = createReadySamplePackets();
    setPackets(samples);
    setSelectedId(samples[0].id);
    setActiveStep("intake");
  }

  const stepSummary = activeStep === "intake" && !hasQueue ? "Choose upload or sample labels to start." : selected?.application.id ?? "No packet selected";

  return (
    <GovShell packetCount={packets.length} modeLabel="Sample evidence mode">
      <main className="page">
        <section className="hero">
          <div>
            <p className="kicker">Short take-home exercise</p>
            <h2>Review label facts against application data.</h2>
            <p>
              Build a queue, confirm application fields, run checks, and review plain-language findings before a final agent decision.
            </p>
          </div>
          <div className="current-card" aria-label="Current selected packet">
            <span>Current packet</span>
            <strong>{selected?.application.id ?? "None selected"}</strong>
            <small>{selected?.application.brand ?? "Upload or restore samples"}</small>
            <OutcomeBadge outcome={selected?.report?.outcome} />
          </div>
        </section>

        <StepNav activeStep={activeStep} onStepChange={(step) => setActiveStep(hasQueue || step === "intake" ? step : "intake")} />

        {activeStep === "intake" && (
          <section className="step-panel">
            <IntakePanel
              isBusy={isBusy}
              queueCount={packets.length}
              onUpload={handleUpload}
              onLoadSamples={loadSamples}
              onRunQueue={runQueue}
              onExport={() => exportReviewCsv(packets)}
              onResetSamples={resetSamples}
            />
            {hasQueue && <ReviewQueue packets={packets} selectedId={selected?.id ?? ""} onSelect={setSelectedId} />}
          </section>
        )}

        {activeStep === "application" && selected && (
          <section className="step-panel">
            <div className="two-column application-step">
              <section className="instruction-card">
                <p className="kicker">Step 2</p>
                <h2>Confirm the expected application facts.</h2>
                <p>
                  These fields represent the submitted application data. The system compares label evidence against these
                  values, so edits here intentionally clear stale findings.
                </p>
                <EvidencePreview packet={selected} />
              </section>
              <ApplicationEditor application={selected.application} score={selected.report?.score} onChange={updateApplication} />
            </div>
          </section>
        )}

        {activeStep === "verify" && selected && (
          <section className="step-panel verify-step">
            <section className="instruction-card">
              <p className="kicker">Step 3</p>
              <h2>Run checks for {selected.application.id}.</h2>
              <p>
                AI extraction is used as an evidence reader when configured. The routing decision comes from deterministic
                rules for warning text, numbers, volume, and tolerant text matching.
              </p>
              <div className="verify-actions">
                <button type="button" className="run-case" onClick={runSelected} disabled={isBusy}>
                  {isBusy ? <Loader2 className="spin" aria-hidden="true" /> : <SearchCheck aria-hidden="true" />}
                  Run this packet
                </button>
                <button type="button" onClick={runQueue} disabled={isBusy}>
                  {isBusy ? <Loader2 className="spin" aria-hidden="true" /> : <SearchCheck aria-hidden="true" />}
                  Run all packets
                </button>
              </div>
            </section>
            <DecisionSummary report={selected.report} />
          </section>
        )}

        {activeStep === "results" && selected && (
          <section className="step-panel results-step">
            <DecisionSummary report={selected.report} />
            {hasReports && <TriageLanes packets={packets} selectedId={selected.id} onSelect={setSelectedId} />}
            <div className="results-layout">
              <div className="results-main">
                <FindingsPanel packet={selected} />
              </div>
              <aside className="results-side">
                <EvidencePreview packet={selected} />
                <section className="review-guide" aria-label="Review guide">
                  <h3>Reviewer next steps</h3>
                  <ol>
                    <li>Resolve problem fields first.</li>
                    <li>Confirm check fields visually.</li>
                    <li>Complete incomplete application data.</li>
                    <li>Export the batch summary if needed.</li>
                  </ol>
                </section>
              </aside>
            </div>
          </section>
        )}

        <footer className="workflow-bar" aria-label="Workflow actions">
          <div>
            <span>Step {stepOrder.indexOf(activeStep) + 1} of {stepOrder.length}</span>
            <strong>{stepSummary}</strong>
          </div>
          <nav>
            {activeStep !== "intake" && (
              <button type="button" className="secondary-action" onClick={() => setActiveStep(previousStep(activeStep))}>
                <ArrowLeft aria-hidden="true" />
                Back
              </button>
            )}
            {activeStep === "intake" && (
              <button type="button" disabled={!hasQueue} onClick={() => setActiveStep("application")}>
                Continue to application data
                <ArrowRight aria-hidden="true" />
              </button>
            )}
            {activeStep === "application" && (
              <button type="button" onClick={() => setActiveStep("verify")}>
                Continue to verification
                <ArrowRight aria-hidden="true" />
              </button>
            )}
            {activeStep === "verify" && (
              <>
                <button type="button" className="secondary-action" onClick={runQueue} disabled={isBusy || !hasQueue}>
                  Run all packets
                </button>
                <button type="button" onClick={runSelected} disabled={isBusy || !selected}>
                  {isBusy ? <Loader2 className="spin" aria-hidden="true" /> : <SearchCheck aria-hidden="true" />}
                  Run this packet
                </button>
              </>
            )}
            {activeStep === "results" && (
              <button type="button" onClick={() => exportReviewCsv(packets)} disabled={!hasReports}>
                Export review summary
              </button>
            )}
          </nav>
        </footer>
      </main>
    </GovShell>
  );
}
