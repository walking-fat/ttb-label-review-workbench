import { z } from "zod";
import { createSamplePackets } from "@/fixtures/reviewPackets";
import { HEALTH_WARNING } from "@/core/standards";
import type { ApplicationPacket, LabelEvidence } from "@/core/model";

export const extractionSchema = z.object({
  brand: z.string(),
  productClass: z.string(),
  alcohol: z.string(),
  proof: z.string(),
  volume: z.string(),
  producer: z.string(),
  origin: z.string(),
  importer: z.string(),
  warning: z.string(),
  transcript: z.string(),
  imageQuality: z.enum(["good", "usable", "poor"]),
  confidence: z.number()
});

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    brand: { type: "string" },
    productClass: { type: "string" },
    alcohol: { type: "string" },
    proof: { type: "string" },
    volume: { type: "string" },
    producer: { type: "string" },
    origin: { type: "string" },
    importer: { type: "string" },
    warning: { type: "string" },
    transcript: { type: "string" },
    imageQuality: { type: "string", enum: ["good", "usable", "poor"] },
    confidence: { type: "number" }
  },
  required: [
    "brand",
    "productClass",
    "alcohol",
    "proof",
    "volume",
    "producer",
    "origin",
    "importer",
    "warning",
    "transcript",
    "imageQuality",
    "confidence"
  ]
};

function sampleKey(value = "") {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sampleExtraction(application: ApplicationPacket, fileName?: string): LabelEvidence {
  const fileKey = sampleKey(fileName);
  const samples = createSamplePackets();
  const sampleByFile = fileKey ? samples.find((packet) => sampleKey(packet.fileName) === fileKey) : undefined;
  const sampleByBrand = samples.find(
    (packet) =>
      sampleKey(packet.application.brand) === sampleKey(application.brand) ||
      packet.application.brand === application.brand
  );
  const sample = sampleByFile ?? sampleByBrand;
  if (sample?.evidence) return sample.evidence;

  return {
    brand: application.brand,
    productClass: application.productClass,
    alcohol: application.alcohol,
    volume: application.volume,
    producer: application.producer,
    origin: application.origin,
    importer: application.importer,
    warning: HEALTH_WARNING,
    transcript: [
      application.brand,
      application.productClass,
      application.alcohol,
      application.volume,
      application.producer,
      application.origin,
      application.importer,
      HEALTH_WARNING
    ]
      .filter(Boolean)
      .join("\n"),
    imageQuality: "usable",
    confidence: 80
  };
}

export async function modelExtraction(imageDataUrl: string, application: ApplicationPacket): Promise<LabelEvidence> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Read visible alcohol label facts for a compliance evidence packet. Do not decide compliance. Expected application context: ${JSON.stringify(application)}`
            },
            {
              type: "input_image",
              image_url: imageDataUrl
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "label_evidence_packet",
          strict: true,
          schema: jsonSchema
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Model extraction failed with status ${response.status}.`);
  }

  const payload = await response.json();
  const textOutput = payload.output_text ?? payload.output?.[0]?.content?.[0]?.text;
  if (!textOutput) {
    throw new Error("Model response did not include structured output.");
  }

  return extractionSchema.parse(JSON.parse(textOutput));
}
