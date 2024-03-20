import { describe, expect, it } from "vitest";
import categorize from "./categorize";

describe("categorize", () => {
  it("should categorize Ica as mat", () => {
    const cats = [
      { namn: "mat", matches: ["ica", "willys"] },
      { namn: "transport", matches: ["sl"] },
    ];
    const result = categorize("Ica Nära Kragstalund", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should categorize Lön as Lön", () => {
    const cats = [
      { namn: "lön", matches: ["lön"] },
      { namn: "mat", matches: ["ica", "willys"] },
      { namn: "transport", matches: ["sl"] },
    ];
    const result = categorize("Lön", cats);

    expect(result).toStrictEqual("lön");
  });
  it("should handle no match", () => {
    const cats = [
      { namn: "mat", matches: ["ica", "willys"] },
      { namn: "transport", matches: ["sl"] },
    ];
    const result = categorize("McDonalds", cats);

    expect(result).toStrictEqual(null);
  });
});
