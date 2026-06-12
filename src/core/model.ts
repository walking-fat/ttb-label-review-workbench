export type Outcome = "clear" | "check" | "problem" | "incomplete";

export type ProductKind = "spirits" | "wine" | "beer" | "other";

export type ApplicationPacket = {
  id: string;
  brand: string;
  productClass: string;
  alcohol: string;
  volume: string;
  producer: string;
  origin: string;
  importer: string;
  productKind: ProductKind;
};

export type LabelEvidence = {
  brand?: string;
  productClass?: string;
  alcohol?: string;
  proof?: string;
  volume?: string;
  producer?: string;
  origin?: string;
  importer?: string;
  warning?: string;
  transcript?: string;
  imageQuality?: "good" | "usable" | "poor";
  confidence?: number;
};

export type Finding = {
  key: string;
  name: string;
  outcome: Outcome;
  expected: string;
  observed: string;
  explanation: string;
  agentAction: string;
  confidence: number;
};

export type ReviewPacket = {
  id: string;
  fileName: string;
  application: ApplicationPacket;
  evidence?: LabelEvidence;
  report?: ReviewReport;
  imageUrl?: string;
  imageDataUrl?: string;
  state: "ready" | "running" | "done" | "failed";
  error?: string;
};

export type ReviewReport = {
  packetId: string;
  source: "model" | "sample";
  elapsedMs: number;
  outcome: Outcome;
  headline: string;
  recommendation: string;
  score: number;
  counts: Record<Outcome, number>;
  findings: Finding[];
  evidence: LabelEvidence;
};
