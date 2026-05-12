const UNITS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  ate: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  forteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fourty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const PLUS_WORDS = new Set(["plus", "add", "and", "+"]);
const MINUS_WORDS = new Set(["minus", "subtract", "take", "less", "-"]);
const IGNORED = new Set([
  "equals",
  "is",
  "the",
  "a",
  "what",
  "makes",
  "from",
  "away",
  "by",
]);

export function convertWordsToDigits(phrase: string): string {
  const words = phrase
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[.,?]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const result: string[] = [];
  let i = 0;
  while (i < words.length) {
    const w = words[i];
    if (PLUS_WORDS.has(w)) {
      const last = result[result.length - 1];
      if (w === "and" && (result.length === 0 || last === "+" || last === "-")) {
        i += 1;
        continue;
      }
      result.push("+");
    } else if (MINUS_WORDS.has(w)) {
      result.push("-");
    } else if (IGNORED.has(w)) {
      // skip
    } else if (UNITS[w] !== undefined) {
      result.push(String(UNITS[w]));
    } else if (TENS[w] !== undefined) {
      const next = words[i + 1];
      const nextUnit = next !== undefined ? UNITS[next] : undefined;
      if (nextUnit !== undefined && nextUnit < 10) {
        result.push(String(TENS[w] + nextUnit));
        i += 1;
      } else {
        result.push(String(TENS[w]));
      }
    }
    i += 1;
  }
  return result.join("");
}
