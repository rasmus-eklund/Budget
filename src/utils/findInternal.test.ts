import { describe, expect, it } from "vitest";
import {
  countDuplicates,
  distinctDates,
  findInternal,
  hasDuplicates,
  isSameDate,
  sumBelopp,
} from "./findInternal";
import { type Internal } from "~/types";

describe("find internal", () => {
  describe("even number of txs", () => {
    it("should find 2", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -100, typ: "Övrigt", konto: "A", person: "A" },
        { id: "2", belopp: 100, typ: "Insättning", konto: "B", person: "B" },
        { id: "3", belopp: 50, typ: "Övrigt", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2"]);
    });
    it("should find 4", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -100, typ: "Övrigt", konto: "A", person: "A" },
        { id: "2", belopp: 100, typ: "Insättning", konto: "B", person: "A" },
        { id: "3", belopp: -200, typ: "Övrigt", konto: "A", person: "A" },
        { id: "4", belopp: 200, typ: "Insättning", konto: "B", person: "A" },
        { id: "5", belopp: -400, typ: "Övrigt", konto: "A", person: "A" },
        { id: "6", belopp: -250, typ: "E-faktura", konto: "A", person: "A" },
        { id: "7", belopp: -199, typ: "Autogiro", konto: "A", person: "A" },
        { id: "8", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2", "3", "4"]);
    });
    it("should find 6", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -100, typ: "Övrigt", konto: "A", person: "A" },
        { id: "2", belopp: 100, typ: "Insättning", konto: "B", person: "A" },
        { id: "3", belopp: -200, typ: "Övrigt", konto: "A", person: "A" },
        { id: "4", belopp: 200, typ: "Insättning", konto: "B", person: "A" },
        { id: "5", belopp: -300, typ: "Övrigt", konto: "A", person: "A" },
        { id: "6", belopp: 300, typ: "Insättning", konto: "B", person: "A" },
        { id: "7", belopp: -400, typ: "Övrigt", konto: "A", person: "A" },
        { id: "8", belopp: -250, typ: "E-faktura", konto: "A", person: "A" },
        { id: "9", belopp: -199, typ: "Autogiro", konto: "A", person: "A" },
        { id: "10", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2", "3", "4", "5", "6"]);
    });
    it("should find 0", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 100, typ: "Insättning", konto: "A", person: "A" },
        { id: "2", belopp: 100, typ: "Insättning", konto: "B", person: "A" },
        { id: "3", belopp: 50, typ: "Övrigt", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual([]);
    });
  });
  describe("odd number of txs", () => {
    it("should find 0", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 650, typ: "Insättning", konto: "A", person: "A" },
        { id: "2", belopp: 650, typ: "Insättning", konto: "A", person: "A" },
        { id: "3", belopp: 650, typ: "Insättning", konto: "B", person: "A" },
        { id: "4", belopp: -250, typ: "E-faktura", konto: "A", person: "A" },
        { id: "5", belopp: -199, typ: "Autogiro", konto: "A", person: "A" },
        { id: "6", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual([]);
    });
    it("should find 2 internal, income", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 650, typ: "Insättning", konto: "A", person: "A" },
        { id: "2", belopp: -650, typ: "Övrigt", konto: "A", person: "A" },
        { id: "3", belopp: 650, typ: "Insättning", konto: "B", person: "A" },
        { id: "4", belopp: -250, typ: "E-faktura", konto: "A", person: "A" },
        { id: "5", belopp: -199, typ: "Autogiro", konto: "A", person: "A" },
        { id: "6", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["2", "3"]);
    });
    it("should find 2 internal, expense", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -650, typ: "Övrigt", konto: "A", person: "A" },
        { id: "2", belopp: 650, typ: "Insättning", konto: "B", person: "A" },
        { id: "3", belopp: -650, typ: "Pg-Bg", konto: "B", person: "A" },
        { id: "4", belopp: -250, typ: "E-faktura", konto: "A", person: "A" },
        { id: "5", belopp: -199, typ: "Autogiro", konto: "A", person: "A" },
        { id: "6", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2"]);
    });
    it.skip("should find 4 internal, income", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 650, typ: "Insättning", konto: "A", person: "A" },
        { id: "2", belopp: -650, typ: "Övrigt", konto: "A", person: "A" },
        { id: "3", belopp: 650, typ: "Insättning", konto: "B", person: "A" },
        { id: "4", belopp: -650, typ: "Övrigt", konto: "B", person: "A" },
        { id: "5", belopp: 650, typ: "Insättning", konto: "C", person: "A" },
        { id: "6", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["2", "3", "4", "5"]);
    });
    it.skip("should find 4 internal, expense", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -650, typ: "Övrigt", konto: "A", person: "A" },
        { id: "2", belopp: 650, typ: "Insättning", konto: "B", person: "A" },
        { id: "3", belopp: -650, typ: "Övrigt", konto: "B", person: "A" },
        { id: "4", belopp: 650, typ: "Insättning", konto: "C", person: "A" },
        { id: "5", belopp: -650, typ: "Övrigt", konto: "C", person: "A" },
        { id: "6", belopp: -340, typ: "Uttag", konto: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2", "3", "4"]);
    });
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
  it("should find two duplicates", () => {
    const data = [
      { belopp: -1, id: "1" },
      { belopp: 1, id: "2" },
      { belopp: 2, id: "3" },
    ];
    const result = countDuplicates(data);
    expect(result).toEqual([{ count: 2, belopp: 1, ids: ["1", "2"] }]);
  });
  it("should find five duplicates", () => {
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

describe("distinctDates", () => {
  it("should find distinct dates", () => {
    const dates = [
      { datum: new Date("2024-01-01") },
      { datum: new Date("2024-01-02") },
      { datum: new Date("2024-01-01") },
    ];
    const expected = [new Date("2024-01-01"), new Date("2024-01-02")];
    const result = distinctDates(dates);
    expect(result).toEqual(expected);
  });
});

describe("has duplicates", () => {
  it("should find duplicates", () => {
    const data = [{ belopp: 1 }, { belopp: 2 }, { belopp: 2 }];
    const result = hasDuplicates(data);
    expect(result).toBe(true);
  });
  it("should not find duplicates", () => {
    const data = [{ belopp: 1 }, { belopp: 2 }];
    const result = hasDuplicates(data);
    expect(result).toBe(false);
  });
});
