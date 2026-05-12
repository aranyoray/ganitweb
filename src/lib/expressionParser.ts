export type ParsedExpression =
  | { kind: "addition"; a: number; b: number }
  | { kind: "subtraction"; a: number; b: number }
  | { kind: "placeValue"; n: number };

export type ParseErrorKind =
  | "empty"
  | "nonMath"
  | "tooManyTerms"
  | "negativeResult"
  | "outOfRange";

export type ParseResult =
  | { ok: true; value: ParsedExpression }
  | { ok: false; error: ParseErrorKind; message: string };

export const MAX_OPERAND = 99;
export const MAX_PLACE_VALUE = 999;

const ERROR_MESSAGES: Record<ParseErrorKind, string> = {
  empty: "Couldn't read anything. Try again.",
  nonMath:
    "Please use an accepted format (X+Y, X-Y, or a single number).",
  tooManyTerms: "Only two numbers allowed (like 3+4). Try a simpler problem.",
  negativeResult: "First number must be bigger than the second one.",
  outOfRange: "Numbers must be 0–99 (or up to 999 for a single number).",
};

function fail(error: ParseErrorKind): ParseResult {
  return { ok: false, error, message: ERROR_MESSAGES[error] };
}

export function parseExpression(raw: string): ParseResult {
  const cleaned = raw
    .replace(/\s+/g, "")
    .replace(/=\?/g, "")
    .replace(/\?/g, "")
    .replace(/^[=\n\r\t]+|[=\n\r\t]+$/g, "");

  if (cleaned.length === 0) return fail("empty");

  if (/^\d+$/.test(cleaned)) {
    const n = Number(cleaned);
    if (n < 0 || n > MAX_PLACE_VALUE) return fail("outOfRange");
    return { ok: true, value: { kind: "placeValue", n } };
  }

  const plusCount = (cleaned.match(/\+/g) ?? []).length;
  const minusCount = (cleaned.match(/-/g) ?? []).length;
  const opCount = plusCount + minusCount;
  if (opCount === 0) return fail("nonMath");
  if (opCount > 1) return fail("tooManyTerms");

  const op = plusCount === 1 ? "+" : "-";
  const parts = cleaned.split(op);
  if (parts.length !== 2 || !/^\d+$/.test(parts[0]) || !/^\d+$/.test(parts[1])) {
    return fail("nonMath");
  }
  const a = Number(parts[0]);
  const b = Number(parts[1]);
  if (a < 0 || a > MAX_OPERAND || b < 0 || b > MAX_OPERAND) {
    return fail("outOfRange");
  }
  if (op === "+") {
    return { ok: true, value: { kind: "addition", a, b } };
  }
  if (a < b) return fail("negativeResult");
  return { ok: true, value: { kind: "subtraction", a, b } };
}
