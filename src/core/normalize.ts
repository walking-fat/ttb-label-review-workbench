const APOSTROPHE = /[''`]/g;
const NON_WORD = /[^a-z0-9.%/ ]+/gi;

export function normalizeLoose(value = "") {
  return value
    .replace(APOSTROPHE, "")
    .replace(/&/g, " and ")
    .replace(NON_WORD, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizeWarning(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

export function overlapScore(expected: string, observed: string) {
  const left = normalizeLoose(expected);
  const right = normalizeLoose(observed);
  if (!left && !right) return 1;
  if (!left || !right) return 0;
  if (left === right) return 1;

  const expectedTokens = new Set(left.split(" "));
  const observedTokens = new Set(right.split(" "));
  const shared = [...expectedTokens].filter((token) => observedTokens.has(token)).length;
  const total = new Set([...expectedTokens, ...observedTokens]).size;
  return total ? shared / total : 0;
}

export function readAbv(value = "") {
  const match = value.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
}

export function readProof(value = "") {
  const match = value.match(/(\d+(?:\.\d+)?)\s*(?:proof|pf)\b/i);
  return match ? Number(match[1]) : null;
}

export function readMl(value = "") {
  const text = value.toLowerCase();
  const metric = text.match(/(\d+(?:\.\d+)?)\s*(ml|milliliter|milliliters|l|liter|liters)\b/);
  if (metric) {
    return metric[2].startsWith("l") ? Number(metric[1]) * 1000 : Number(metric[1]);
  }

  const ounces = text.match(/(\d+(?:\.\d+)?)\s*(?:fl\.?\s*)?oz\b/);
  return ounces ? Number(ounces[1]) * 29.5735 : null;
}

export function closeEnough(left: number | null, right: number | null, tolerance: number) {
  return left !== null && right !== null && Math.abs(left - right) <= tolerance;
}
