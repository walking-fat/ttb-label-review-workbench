import { HEALTH_WARNING } from "./standards";
import { closeEnough, normalizeLoose, normalizeWarning, overlapScore, readAbv, readMl, readProof } from "./normalize";
import type { ApplicationPacket, Finding, LabelEvidence, Outcome, ReviewReport } from "./model";

function fieldFinding(input: {
  key: string;
  name: string;
  expected: string;
  observed?: string;
  required?: boolean;
  threshold?: number;
}): Finding {
  const expected = input.expected.trim();
  const observed = (input.observed ?? "").trim();

  if (!expected && input.required !== false) {
    return {
      key: input.key,
      name: input.name,
      outcome: "incomplete",
      expected: "",
      observed,
      explanation: "The application packet does not include this expected value.",
      agentAction: "Complete the application data or hold the item for manual review.",
      confidence: 0
    };
  }

  if (!observed) {
    return {
      key: input.key,
      name: input.name,
      outcome: input.required === false ? "check" : "problem",
      expected,
      observed: "",
      explanation: "The label evidence did not include this expected field.",
      agentAction: "Inspect the artwork and request a corrected label if the field is absent.",
      confidence: 0
    };
  }

  const score = overlapScore(expected, observed);
  if (normalizeLoose(expected) === normalizeLoose(observed) || score >= 0.95) {
    return {
      key: input.key,
      name: input.name,
      outcome: "clear",
      expected,
      observed,
      explanation: "The values match after normalizing case, punctuation, and spacing.",
      agentAction: "No follow-up needed for this field.",
      confidence: Math.round(score * 100)
    };
  }

  if (score >= (input.threshold ?? 0.72)) {
    return {
      key: input.key,
      name: input.name,
      outcome: "check",
      expected,
      observed,
      explanation: "The values are close enough to be plausible, but the agent should confirm the difference.",
      agentAction: "Compare the application and label visually before approving.",
      confidence: Math.round(score * 100)
    };
  }

  return {
    key: input.key,
    name: input.name,
    outcome: "problem",
    expected,
    observed,
    explanation: "The value read from the label does not match the application packet.",
    agentAction: "Resolve the mismatch before the item moves forward.",
    confidence: Math.round(score * 100)
  };
}

function alcoholFinding(expected: string, evidence: LabelEvidence): Finding {
  const observed = [evidence.alcohol, evidence.proof].filter(Boolean).join(" / ");
  if (!expected.trim() || !observed) {
    return fieldFinding({ key: "alcohol", name: "Alcohol content", expected, observed });
  }

  const expectedAbv = readAbv(expected);
  const observedAbv = readAbv(observed);
  const expectedProof = readProof(expected);
  const observedProof = readProof(observed);
  const abvOk = closeEnough(expectedAbv, observedAbv, 0.3);
  const proofOk = expectedProof === null || closeEnough(expectedProof, observedProof, 0.6);

  if (abvOk && proofOk) {
    return {
      key: "alcohol",
      name: "Alcohol content",
      outcome: "clear",
      expected,
      observed,
      explanation: "ABV and proof agree within the prototype tolerance.",
      agentAction: "No follow-up needed for this field.",
      confidence: 98
    };
  }

  return {
    key: "alcohol",
    name: "Alcohol content",
    outcome: abvOk || proofOk ? "check" : "problem",
    expected,
    observed,
    explanation: "Numeric alcohol values are checked directly; the prototype does not fuzzy-match numbers.",
    agentAction: abvOk || proofOk ? "Confirm the paired ABV/proof statement." : "Resolve the numeric mismatch.",
    confidence: abvOk || proofOk ? 70 : 15
  };
}

function volumeFinding(expected: string, observed = ""): Finding {
  const expectedMl = readMl(expected);
  const observedMl = readMl(observed);
  if (!expected.trim() || !observed.trim()) {
    return fieldFinding({ key: "volume", name: "Net contents", expected, observed });
  }

  if (closeEnough(expectedMl, observedMl, 5)) {
    return {
      key: "volume",
      name: "Net contents",
      outcome: "clear",
      expected,
      observed,
      explanation: "Package size matches after converting units to milliliters.",
      agentAction: "No follow-up needed for this field.",
      confidence: 98
    };
  }

  return {
    key: "volume",
    name: "Net contents",
    outcome: "problem",
    expected,
    observed,
    explanation: "The package size read from the label differs from the application packet.",
    agentAction: "Check whether the label artwork or application value needs correction.",
    confidence: 20
  };
}

function warningFinding(warning = ""): Finding {
  const observed = normalizeWarning(warning);
  const expected = HEALTH_WARNING;
  if (observed === normalizeWarning(expected)) {
    return {
      key: "warning",
      name: "Government health warning",
      outcome: "clear",
      expected,
      observed: warning,
      explanation: "The mandatory warning text and all-caps prefix match.",
      agentAction: "Agent should still confirm size, boldness, and placement visually.",
      confidence: 100
    };
  }

  return {
    key: "warning",
    name: "Government health warning",
    outcome: "problem",
    expected,
    observed: warning,
    explanation: observed.startsWith("GOVERNMENT WARNING:")
      ? "The prefix is correct, but the warning wording is not an exact match."
      : "The warning prefix is missing or not exactly uppercase.",
    agentAction: "Request corrected artwork or conduct a word-for-word manual warning check.",
    confidence: warning ? 35 : 0
  };
}

function summary(findings: Finding[]) {
  const counts: Record<Outcome, number> = { clear: 0, check: 0, problem: 0, incomplete: 0 };
  findings.forEach((finding) => {
    counts[finding.outcome] += 1;
  });

  const score = Math.round(findings.reduce((sum, finding) => sum + finding.confidence, 0) / findings.length);
  if (counts.problem) {
    return {
      outcome: "problem" as const,
      headline: `${counts.problem} correction item${counts.problem > 1 ? "s" : ""}`,
      recommendation: "Review problem fields before this application moves forward.",
      score,
      counts
    };
  }
  if (counts.check || counts.incomplete) {
    return {
      outcome: "check" as const,
      headline: "Agent confirmation needed",
      recommendation: "Complete missing data and confirm close matches visually.",
      score,
      counts
    };
  }
  return {
    outcome: "clear" as const,
    headline: "No automated concerns",
    recommendation: "The item is ready for the agent's final approval decision.",
    score,
    counts
  };
}

export function reviewApplication(
  application: ApplicationPacket,
  evidence: LabelEvidence,
  packetId = application.id,
  source: ReviewReport["source"] = "sample",
  elapsedMs = 0
): ReviewReport {
  const findings = [
    fieldFinding({ key: "brand", name: "Brand name", expected: application.brand, observed: evidence.brand, threshold: 0.7 }),
    fieldFinding({
      key: "class",
      name: "Class/type",
      expected: application.productClass,
      observed: evidence.productClass,
      threshold: 0.66
    }),
    alcoholFinding(application.alcohol, evidence),
    volumeFinding(application.volume, evidence.volume),
    fieldFinding({ key: "producer", name: "Producer/bottler", expected: application.producer, observed: evidence.producer, threshold: 0.6 }),
    ...(application.origin
      ? [fieldFinding({ key: "origin", name: "Country of origin", expected: application.origin, observed: evidence.origin, threshold: 0.7 })]
      : []),
    ...(application.importer
      ? [fieldFinding({ key: "importer", name: "Importer", expected: application.importer, observed: evidence.importer, threshold: 0.6 })]
      : []),
    warningFinding(evidence.warning)
  ];
  const result = summary(findings);

  return {
    packetId,
    source,
    elapsedMs,
    evidence,
    findings,
    ...result
  };
}
