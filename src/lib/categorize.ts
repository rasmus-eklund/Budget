import type { Tx, Category } from "~/types";

const normalize = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

const tokenize = (s: string): string[] =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

export const categorize = (
  text: string,
  categories: Category[],
): string | null => {
  const normText = normalize(text);
  const tokens = tokenize(text);

  let bestCategory: string | null = null;
  let bestPatternLength = 0;

  for (const { name, match } of categories) {
    for (const m of match) {
      const normPattern = normalize(m.name);
      const patternTokens = tokenize(m.name);

      let isMatch = false;

      if (normPattern.length <= 3) {
        // Short patterns: tokenized match, require each token ≥2 chars
        isMatch = patternTokens.every(
          (pt) => pt.length >= 2 && tokens.includes(pt),
        );
      } else {
        // Long patterns: only exact substring match
        isMatch = normText.includes(normPattern);
      }

      if (isMatch && normPattern.length > bestPatternLength) {
        // Longer pattern wins if multiple matches
        bestPatternLength = normPattern.length;
        bestCategory = name;
      }
    }
  }

  return bestCategory;
};

export const applyCategory = ({
  tx,
  categories,
}: {
  tx: Tx;
  categories: Category[];
}) => {
  if (tx.budgetgrupp === "inom") {
    return tx;
  }
  if (tx.belopp > 0) {
    return { ...tx, budgetgrupp: "inkomst" };
  }
  return {
    ...tx,
    budgetgrupp: categorize(tx.text, categories) ?? tx.budgetgrupp,
  };
};
