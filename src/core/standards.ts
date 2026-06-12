export const HEALTH_WARNING =
  "GOVERNMENT WARNING: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems.";

export const DEFAULT_PACKET = {
  id: "COLA-26-10492",
  brand: "OLD TOM DISTILLERY",
  productClass: "Kentucky Straight Bourbon Whiskey",
  alcohol: "45% Alc./Vol. (90 Proof)",
  volume: "750 mL",
  producer: "Bottled by Old Tom Distillery, Bardstown, KY",
  origin: "",
  importer: "",
  productKind: "spirits" as const
};

export const OUTCOME_TEXT = {
  clear: "Clear",
  check: "Check",
  problem: "Problem",
  incomplete: "Incomplete"
} as const;
