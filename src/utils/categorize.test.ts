import { describe, expect, it } from "vitest";
import categorize from "./categorize";

describe("categorize", () => {
  it("should categorize correctly", () => {
    const cats = [
      { namn: "mat", matches: ["ica", "willys"] },
      { namn: "transport", matches: ["sl"] },
    ];
    const result = categorize("Ica Nära Kragstalund", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should handle no match", () => {
    const cats = [
      { namn: "mat", matches: ["ica", "willys"] },
      { namn: "transport", matches: ["sl"] },
    ];
    const result = categorize("McDonalds", cats);

    expect(result).toStrictEqual("Övrigt");
  });
});
