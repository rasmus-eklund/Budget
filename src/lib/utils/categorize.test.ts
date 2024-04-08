import { describe, expect, it } from "vitest";
import categorize from "./categorize";

describe("categorize", () => {
  it("should categorize Ica as mat", () => {
    const cats = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "transport", match: [{ name: "sl" }] },
    ];
    const result = categorize("Ica Nära Kragstalund", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should categorize Lön as Lön", () => {
    const cats = [
      { name: "lön", match: [{ name: "lön" }] },
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "transport", match: [{ name: "sl" }] },
    ];
    const result = categorize("Lön", cats);

    expect(result).toStrictEqual("lön");
  });
  it("should categorize teslaamo22-05 as lån", () => {
    const cats = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }, { name: "foodora" }] },
      { name: "transport", match: [{ name: "sl" }, { name: "sj" }] },
    ];
    const result = categorize("K*foodora.se", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should categorize foodora", () => {
    const cats = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "lån", match: [{ name: "teslaamo" }] },
      { name: "transport", match: [{ name: "sl" }, { name: "Tesla inc" }] },
    ];
    const result = categorize("Teslaamo22-04", cats);

    expect(result).toStrictEqual("lån");
  });
  it("should handle no match", () => {
    const cats = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "transport", match: [{ name: "sl" }] },
    ];
    const result = categorize("McDonalds", cats);

    expect(result).toStrictEqual(null);
  });
});
