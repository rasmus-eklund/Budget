import { describe, expect, it } from "bun:test";
import { categorize } from "./categorize";
import { type Category } from "~/types";

describe("categorize", () => {
  it("should categorize Ica as mat", () => {
    const cats: Category[] = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "transport", match: [{ name: "sl" }] },
    ];
    const result = categorize("Ica Nära Kragstalund", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should find item in middle of string", () => {
    const cats: Category[] = [
      {
        name: "mat",
        match: [{ name: "ica" }, { name: "willys" }, { name: "matmat" }],
      },
      { name: "transport", match: [{ name: "sl" }, { name: "sj" }] },
    ];
    const result = categorize("K*MatMat.Se", cats);

    expect(result).toStrictEqual("mat");
  });
  it("should categorize correctly distinguish similar items", () => {
    const cats: Category[] = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "lån", match: [{ name: "abababb" }] },
      { name: "transport", match: [{ name: "sl" }, { name: "abababc" }] },
    ];
    const result = categorize("abababb", cats);

    expect(result).toStrictEqual("lån");
  });
  it("should handle no match", () => {
    const cats: Category[] = [
      { name: "mat", match: [{ name: "ica" }, { name: "willys" }] },
      { name: "transport", match: [{ name: "sl" }] },
    ];
    const result = categorize("McDonalds", cats);

    expect(result).toStrictEqual(null);
  });

  it("should handle Sl App correctly", () => {
    const cats: Category[] = [
      { name: "transport", match: [{ name: "sl" }, { name: "Sl App" }] },
      { name: "mat", match: [{ name: "ica" }] },
    ];
    const result = categorize("K*Sl App", cats);

    expect(result).toStrictEqual("transport");
  });

  it("should handle H & M correctly", () => {
    const cats: Category[] = [
      {
        name: "kläder",
        match: [{ name: "H & M Henn" }, { name: "H & M" }, { name: "Lindex" }],
      },
      { name: "mat", match: [{ name: "ica" }] },
    ];
    const result = categorize("K*H & M Henn", cats);

    expect(result).toStrictEqual("kläder");
  });

  it("should not falsely match Jula Sveri or Lekakademi", () => {
    const cats: Category[] = [
      { name: "räkningar", match: [{ name: "a-kassa" }, { name: "hyra" }] },
      { name: "mat", match: [{ name: "ica" }] },
    ];
    expect(categorize("K*Jula Sveri", cats)).toBeNull();
    expect(categorize("K*Lekakademi", cats)).toBeNull();
  });

  it("should correctly match ICA Bolån to lån", () => {
    const cats: Category[] = [
      { name: "lån", match: [{ name: "ICA Bolån" }] },
      { name: "mat", match: [{ name: "ica" }] },
    ];
    const result = categorize("Ica Bolån", cats);

    expect(result).toStrictEqual("lån");
  });

  it("should not match truncated pattern unless provided", () => {
    const cats: Category[] = [
      { name: "alkohol", match: [{ name: "systembolaget" }] },
    ];
    const result = categorize("systembo", cats);

    expect(result).toBeNull();
  });

  it("should match sl but not sladd", () => {
    const cats: Category[] = [{ name: "transport", match: [{ name: "sl" }] }];
    expect(categorize("Sl Universitetet", cats)).toStrictEqual("transport");
    expect(categorize("sladd", cats)).toBeNull();
  });
});
