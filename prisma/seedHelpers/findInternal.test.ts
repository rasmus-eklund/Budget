import { describe, expect, it } from "vitest";
import data from "../../backup/txs.json";
import {
  countDuplicates,
  findInternal,
  isSameDate,
  sumBelopp,
} from "./findInternal";
import { type Tx } from "~/zodSchemas";

const stringToDate = (s: string) => new Date(s);
const getDay = (txs: Tx[], target: Date) =>
  txs
    .filter((i) => isSameDate(i, target))
    .map((tx, i) => ({ ...tx, id: i.toString() }));

describe("find internal", () => {
  it("should find 4 on 23-08-04", () => {
    const txs = data.map((i) => ({ ...i, datum: stringToDate(i.datum) }));
    const target = new Date("2023-08-04");
    const day = getDay(txs, target);
    const testdata = findInternal(day).flatMap((i) => i.ids);
    expect(day.length).toStrictEqual(6);
    expect(testdata.length).toStrictEqual(4);
  });
  it("should find 6 on 23-08-14", () => {
    const txs = data.map((i) => ({ ...i, datum: stringToDate(i.datum) }));
    const target = new Date("2023-08-14");
    const day = getDay(txs, target);
    const testdata = findInternal(day).flatMap((i) => i.ids);
    expect(day.length).toStrictEqual(7);
    expect(testdata.length).toStrictEqual(6);
  });
});

describe("subBelopp", () => {
  it("should sum to 6", () => {
    const data = [{ belopp: 2 }, { belopp: 2 }, { belopp: 2 }];
    const result = sumBelopp(data);
    expect(result).toEqual(6);
  });
});

describe("isSameDate", () => {
  it("should be true", () => {
    const obj1 = { datum: new Date("2024-01-01") };
    const target1 = new Date("2024-01-01");
    const result1 = isSameDate(obj1, target1);
    expect(result1).toBe(true);
  });

  it("should be false", () => {
    const obj2 = { datum: new Date("2024-01-01") };
    const target2 = new Date("2024-01-02");
    const result2 = isSameDate(obj2, target2);
    expect(result2).toBe(false);
  });
});

describe("countDuplicates", () => {
  it("should be find one duplicate", () => {
    const data = [
      { belopp: -1, id: "1" },
      { belopp: 1, id: "2" },
      { belopp: 2, id: "3" },
    ];
    const result = countDuplicates(data);
    expect(result).toEqual([{ count: 2, belopp: 1, ids: ["1", "2"] }]);
  });
  it("should be 4", () => {
    const data = [
      { belopp: -1, id: "1" },
      { belopp: 1, id: "2" },
      { belopp: -2, id: "3" },
      { belopp: 2, id: "4" },
      { belopp: 2, id: "5" },
    ];
    const result = countDuplicates(data);
    expect(result).toEqual([
      { count: 2, belopp: 1, ids: ["1", "2"] },
      { count: 3, belopp: 2, ids: ["3", "4", "5"] },
    ]);
  });
});
