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
  it("should find item in middle of string", () => {
    const cats = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }, { name: "matmat" }] },
      { name: "transport", match: [{ name: "sl" }, { name: "sj" }] },
    ];
    const result = categorize("K*MatMat.Se", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should categorize correctly distinguish similar items", () => {
    const cats = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "lån", match: [{ name: "abababb" }] },
      { name: "transport", match: [{ name: "sl" }, { name: "abababc" }] },
    ];
    const result = categorize("abababb", cats);

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
