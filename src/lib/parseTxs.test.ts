import { describe, expect, it } from "bun:test";
import parseTxs from "./parseTxs";

const config = {
  skipLines: 0,
  columns: {},
};

describe("parseTxs", () => {
  it("assigns zero-based source order after applying upload row order", async () => {
    const csv = [
      "datum,text,belopp,saldo",
      "2025-01-01,first,10,10",
      "2025-01-02,second,20,30",
      "2025-01-03,third,30,60",
    ].join("\n");

    const result = await parseTxs({
      bankAccountId: "account-a",
      buffer: Buffer.from(csv),
      config,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {return;}

    expect(
      result.data.map(({ text, sourceOrder }) => ({ text, sourceOrder })),
    ).toEqual([
      { text: "third", sourceOrder: 0 },
      { text: "second", sourceOrder: 1 },
      { text: "first", sourceOrder: 2 },
    ]);
  });
});
