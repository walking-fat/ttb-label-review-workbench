import type { ReviewPacket } from "@/core/model";
import { reviewApplication } from "@/core/review";
import { DEFAULT_PACKET, HEALTH_WARNING } from "@/core/standards";

const packets: Omit<ReviewPacket, "report" | "state">[] = [
  {
    id: "packet-old-tom",
    fileName: "old-tom-bourbon.png",
    application: DEFAULT_PACKET,
    evidence: {
      brand: "OLD TOM DISTILLERY",
      productClass: "Kentucky Straight Bourbon Whiskey",
      alcohol: "45% Alc./Vol.",
      proof: "90 Proof",
      volume: "750 mL",
      producer: "Bottled by Old Tom Distillery, Bardstown, KY",
      warning: HEALTH_WARNING,
      transcript: [
        "OLD TOM DISTILLERY",
        "Kentucky Straight Bourbon Whiskey",
        "45% Alc./Vol. (90 Proof)",
        "Net Contents 750 mL",
        "Bottled by Old Tom Distillery, Bardstown, KY",
        HEALTH_WARNING
      ].join("\n"),
      imageQuality: "good",
      confidence: 97
    }
  },
  {
    id: "packet-stones-throw",
    fileName: "stones-throw-import.png",
    application: {
      ...DEFAULT_PACKET,
      id: "COLA-26-10503",
      brand: "STONE'S THROW",
      productClass: "Highland Single Malt Scotch Whisky",
      alcohol: "43% Alc./Vol. (86 Proof)",
      producer: "Produced by Stone's Throw Spirits, Inverness, Scotland",
      origin: "Product of Scotland",
      importer: "Imported by Cascade Importers, Seattle, WA"
    },
    evidence: {
      brand: "Stones Throw",
      productClass: "Highland Single Malt Scotch Whisky",
      alcohol: "43% Alc./Vol.",
      proof: "86 Proof",
      volume: "750 ml",
      producer: "Produced by Stones Throw Spirits, Inverness Scotland",
      origin: "Product of Scotland",
      importer: "Imported by Cascade Importers, Seattle WA",
      warning: HEALTH_WARNING,
      transcript: [
        "Stones Throw",
        "Highland Single Malt Scotch Whisky",
        "43% Alc./Vol. (86 Proof)",
        "750 ml",
        "Produced by Stones Throw Spirits, Inverness Scotland",
        "Product of Scotland",
        "Imported by Cascade Importers, Seattle WA",
        HEALTH_WARNING
      ].join("\n"),
      imageQuality: "usable",
      confidence: 91
    }
  },
  {
    id: "packet-warning-case",
    fileName: "north-coast-gin.png",
    application: {
      ...DEFAULT_PACKET,
      id: "COLA-26-10561",
      brand: "NORTH COAST GIN",
      productClass: "Distilled Gin",
      alcohol: "47% Alc./Vol. (94 Proof)",
      producer: "Distilled by North Coast Craft, Portland, OR"
    },
    evidence: {
      brand: "NORTH COAST GIN",
      productClass: "Distilled Gin",
      alcohol: "47% Alc./Vol.",
      proof: "94 Proof",
      volume: "750 mL",
      producer: "Distilled by North Coast Craft, Portland, OR",
      warning: HEALTH_WARNING.replace("GOVERNMENT WARNING:", "Government Warning:"),
      transcript: [
        "NORTH COAST GIN",
        "Distilled Gin",
        "47% Alc./Vol. (94 Proof)",
        "Net Contents 750 mL",
        "Distilled by North Coast Craft, Portland, OR",
        HEALTH_WARNING.replace("GOVERNMENT WARNING:", "Government Warning:")
      ].join("\n"),
      imageQuality: "good",
      confidence: 95
    }
  },
  {
    id: "packet-incomplete",
    fileName: "blue-harbor-rum.png",
    application: {
      ...DEFAULT_PACKET,
      id: "COLA-26-10547",
      brand: "BLUE HARBOR RUM",
      productClass: "",
      alcohol: "40% Alc./Vol. (80 Proof)",
      producer: "Bottled by Blue Harbor Spirits, San Juan, PR"
    },
    evidence: {
      brand: "BLUE HARBOR RUM",
      productClass: "Caribbean White Rum",
      alcohol: "40% Alc./Vol.",
      proof: "80 Proof",
      volume: "750 mL",
      producer: "Bottled by Blue Harbor Spirits, San Juan, PR",
      warning: HEALTH_WARNING,
      transcript: [
        "BLUE HARBOR RUM",
        "Caribbean White Rum",
        "40% Alc./Vol. (80 Proof)",
        "750 mL",
        "Bottled by Blue Harbor Spirits, San Juan, PR",
        HEALTH_WARNING
      ].join("\n"),
      imageQuality: "usable",
      confidence: 88
    }
  }
];

export function createSamplePackets(): ReviewPacket[] {
  return packets.map((packet) => ({
    ...packet,
    state: "done",
    report: reviewApplication(packet.application, packet.evidence ?? {}, packet.id, "sample", 420)
  }));
}

export function createReadySamplePackets(): ReviewPacket[] {
  return packets.map((packet) => ({
    ...packet,
    state: "ready"
  }));
}

export function createUploadPacket(file: File, index: number, imageDataUrl: string): ReviewPacket {
  return {
    id: `upload-${Date.now()}-${index}`,
    fileName: file.name,
    state: "ready",
    application: {
      ...DEFAULT_PACKET,
      id: `UPLOAD-${String(index + 1).padStart(3, "0")}`
    },
    imageUrl: URL.createObjectURL(file),
    imageDataUrl
  };
}
