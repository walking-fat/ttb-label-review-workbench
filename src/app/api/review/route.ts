import { NextResponse } from "next/server";
import { z } from "zod";
import { reviewApplication } from "@/core/review";
import { modelExtraction, sampleExtraction } from "@/server/extraction";

const packetSchema = z.object({
  id: z.string(),
  brand: z.string(),
  productClass: z.string(),
  alcohol: z.string(),
  volume: z.string(),
  producer: z.string(),
  origin: z.string(),
  importer: z.string(),
  productKind: z.enum(["spirits", "wine", "beer", "other"])
});

const requestSchema = z.object({
  application: packetSchema,
  fileName: z.string().optional(),
  imageDataUrl: z.string().optional(),
  forceSample: z.boolean().optional()
});

export async function POST(request: Request) {
  const start = performance.now();

  try {
    const body = requestSchema.parse(await request.json());
    let source: "model" | "sample" = "sample";
    let evidence = sampleExtraction(body.application, body.fileName);

    if (body.imageDataUrl && !body.forceSample && process.env.OPENAI_API_KEY) {
      try {
        evidence = await modelExtraction(body.imageDataUrl, body.application);
        source = "model";
      } catch (error) {
        console.warn("Model extraction failed; continuing with sample extraction.", error);
      }
    }

    const elapsedMs = Math.round(performance.now() - start);
    const report = reviewApplication(body.application, evidence, body.application.id, source, elapsedMs);
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Review failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
