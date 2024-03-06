import { describe, it, expect } from "vitest";
import data from "../../backup/txs.json";
import { getDay, stringToDate } from "./findInternal";
import groupBy from "./groupBy";

describe("groupBy", () => {
  const txs = data.map((i) => ({ ...i, datum: stringToDate(i.datum) }));
  const target = new Date("2023-08-04");
  const day = getDay(txs, target).map((tx, n) => ({
    ...tx,
    budgetgrupp: n % 2 === 0 ? "odd" : "even",
  }));
  it("should group correctly", () => {
    const grouped = groupBy(day);
    expect(Object.keys(grouped)).toEqual(["odd", "even"]);
    expect(grouped.odd).toHaveLength(3);
    expect(grouped.even).toHaveLength(3);
  });
});
