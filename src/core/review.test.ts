import { describe, expect, it } from "vitest";
import { closeEnough, overlapScore, readAbv, readMl, readProof } from "./normalize";
import { reviewApplication } from "./review";
import { DEFAULT_PACKET, HEALTH_WARNING } from "./standards";
import { sampleExtraction } from "@/server/extraction";

describe("normalization utilities", () => {
  it("treats punctuation-only brand differences as the same", () => {
    expect(overlapScore("STONE'S THROW", "Stones Throw")).toBe(1);
  });

  it("parses alcohol and package-size formats", () => {
    expect(readAbv("45% Alc./Vol.")).toBe(45);
    expect(readProof("90 Proof")).toBe(90);
    expect(readMl("0.75 L")).toBe(750);
    expect(closeEnough(readMl("25.4 fl oz"), 750, 5)).toBe(true);
  });
});

describe("reviewApplication", () => {
  it("clears a complete matching label", () => {
    const report = reviewApplication(DEFAULT_PACKET, {
      brand: DEFAULT_PACKET.brand,
      productClass: DEFAULT_PACKET.productClass,
      alcohol: "45% Alc./Vol.",
      proof: "90 Proof",
      volume: "750 mL",
      producer: DEFAULT_PACKET.producer,
      warning: HEALTH_WARNING
    });

    expect(report.outcome).toBe("clear");
    expect(report.counts.problem).toBe(0);
  });

  it("does not fuzzy-match incorrect alcohol numbers", () => {
    const report = reviewApplication(DEFAULT_PACKET, {
      brand: DEFAULT_PACKET.brand,
      productClass: DEFAULT_PACKET.productClass,
      alcohol: "47% Alc./Vol.",
      proof: "94 Proof",
      volume: DEFAULT_PACKET.volume,
      producer: DEFAULT_PACKET.producer,
      warning: HEALTH_WARNING
    });

    expect(report.findings.find((finding) => finding.key === "alcohol")?.outcome).toBe("problem");
  });

  it("flags warning capitalization differences", () => {
    const report = reviewApplication(DEFAULT_PACKET, {
      brand: DEFAULT_PACKET.brand,
      productClass: DEFAULT_PACKET.productClass,
      alcohol: DEFAULT_PACKET.alcohol,
      proof: "90 Proof",
      volume: DEFAULT_PACKET.volume,
      producer: DEFAULT_PACKET.producer,
      warning: HEALTH_WARNING.replace("GOVERNMENT WARNING:", "Government Warning:")
    });

    expect(report.findings.find((finding) => finding.key === "warning")?.outcome).toBe("problem");
  });

  it("routes blank application fields to incomplete instead of false mismatch", () => {
    const report = reviewApplication(
      { ...DEFAULT_PACKET, productClass: "" },
      {
        brand: DEFAULT_PACKET.brand,
        productClass: "Kentucky Straight Bourbon Whiskey",
        alcohol: DEFAULT_PACKET.alcohol,
        proof: "90 Proof",
        volume: DEFAULT_PACKET.volume,
        producer: DEFAULT_PACKET.producer,
        warning: HEALTH_WARNING
      }
    );

    expect(report.findings.find((finding) => finding.key === "class")?.outcome).toBe("incomplete");
  });

  it("maps local SVG fixture filenames to deterministic sample evidence", () => {
    const evidence = sampleExtraction(DEFAULT_PACKET, "north-coast-gin.svg");
    const report = reviewApplication(
      {
        ...DEFAULT_PACKET,
        id: "COLA-26-10561",
        brand: "NORTH COAST GIN",
        productClass: "Distilled Gin",
        alcohol: "47% Alc./Vol. (94 Proof)",
        producer: "Distilled by North Coast Craft, Portland, OR"
      },
      evidence
    );

    expect(report.findings.find((finding) => finding.key === "warning")?.outcome).toBe("problem");
  });
});
