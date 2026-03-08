import { describe, expect, it } from "bun:test";
import { findInternal, hasDuplicates, sumBelopp } from "./findInternal";
import { type Internal } from "~/types";

describe("find internal", () => {
  describe("even number of txs", () => {
    it("should find 2", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -100, bankAccountId: "AA" },
        { id: "2", belopp: 100, bankAccountId: "AB" },
        { id: "3", belopp: 50, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2"]);
    });
    it("should find 4", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -100, bankAccountId: "AA" },
        { id: "2", belopp: 100, bankAccountId: "BA" },
        { id: "3", belopp: -200, bankAccountId: "AA" },
        { id: "4", belopp: 200, bankAccountId: "BA" },
        { id: "5", belopp: -400, bankAccountId: "AA" },
        { id: "6", belopp: -250, bankAccountId: "AA" },
        { id: "7", belopp: -199, bankAccountId: "AA" },
        { id: "8", belopp: -340, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2", "3", "4"]);
    });
    it("should find 6", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -100, bankAccountId: "AA" },
        { id: "2", belopp: 100, bankAccountId: "BA" },
        { id: "3", belopp: -200, bankAccountId: "AA" },
        { id: "4", belopp: 200, bankAccountId: "BA" },
        { id: "5", belopp: -300, bankAccountId: "AA" },
        { id: "6", belopp: 300, bankAccountId: "BA" },
        { id: "7", belopp: -400, bankAccountId: "AA" },
        { id: "8", belopp: -250, bankAccountId: "AA" },
        { id: "9", belopp: -199, bankAccountId: "AA" },
        { id: "10", belopp: -340, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2", "3", "4", "5", "6"]);
    });
    it("should find 0", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 100, bankAccountId: "AA" },
        { id: "2", belopp: 100, bankAccountId: "BA" },
        { id: "3", belopp: 50, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual([]);
    });
    it("should find only same-person pair in ambiguous 4-group", () => {
      const txs = [
        { id: "1", belopp: 1325, bankAccountId: "A", person: "A" },
        { id: "2", belopp: -1325, bankAccountId: "B", person: "A" },
        { id: "3", belopp: 1325, bankAccountId: "B", person: "A" },
        { id: "4", belopp: 1325, bankAccountId: "C", person: "B" },
      ] as Internal[];
      const ids = findInternal(txs);
      expect(ids).toEqual(["2", "1"]);
    });
    it("should still match one pair in ambiguous 4-group without person", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 1325, bankAccountId: "A" },
        { id: "2", belopp: -1325, bankAccountId: "B" },
        { id: "3", belopp: 1325, bankAccountId: "B" },
        { id: "4", belopp: 1325, bankAccountId: "C" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["2", "1"]);
    });
    it("should allow cross-person internal when needed", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -900, bankAccountId: "A", person: "A" },
        { id: "2", belopp: 900, bankAccountId: "B", person: "B" },
        { id: "3", belopp: 900, bankAccountId: "A", person: "A" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2"]);
    });
  });
  describe("odd number of txs", () => {
    it("should find 0", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 650, bankAccountId: "AA" },
        { id: "2", belopp: 650, bankAccountId: "AA" },
        { id: "3", belopp: 650, bankAccountId: "BA" },
        { id: "4", belopp: -250, bankAccountId: "AA" },
        { id: "5", belopp: -199, bankAccountId: "AA" },
        { id: "6", belopp: -340, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual([]);
    });
    it("should find 2 internal from 3 odd, income", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 650, bankAccountId: "AA" },
        { id: "2", belopp: -650, bankAccountId: "AA" },
        { id: "3", belopp: 650, bankAccountId: "BA" },
        { id: "4", belopp: -250, bankAccountId: "AA" },
        { id: "5", belopp: -199, bankAccountId: "AA" },
        { id: "6", belopp: -340, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["2", "3"]);
    });
    it("should find 2 internal from 3 odd, expense", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -650, bankAccountId: "AA" },
        { id: "2", belopp: 650, bankAccountId: "BA" },
        { id: "3", belopp: -650, bankAccountId: "BA" },
        { id: "4", belopp: -250, bankAccountId: "AA" },
        { id: "5", belopp: -199, bankAccountId: "AA" },
        { id: "6", belopp: -340, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["1", "2"]);
    });
    it.skip("should find 4 internal from 5 odd, income", () => {
      const txs: Internal[] = [
        { id: "1", belopp: 650, bankAccountId: "AA" },
        { id: "2", belopp: -650, bankAccountId: "AA" },
        { id: "3", belopp: 650, bankAccountId: "BA" },
        { id: "4", belopp: -650, bankAccountId: "BA" },
        { id: "5", belopp: 650, bankAccountId: "CA" },
        { id: "6", belopp: -340, bankAccountId: "AA" },
      ];
      const ids = findInternal(txs);
      expect(ids).toEqual(["2", "3", "4", "5"]);
    });
    it.skip("should find 4 internal from 5 odd, expense", () => {
      const txs: Internal[] = [
        { id: "1", belopp: -650, bankAccountId: "AA" },
        { id: "2", belopp: 650, bankAccountId: "BA" },
        { id: "3", belopp: -650, bankAccountId: "BA" },
        { id: "4", belopp: 650, bankAccountId: "CA" },
        { id: "5", belopp: -650, bankAccountId: "CA" },
        { id: "6", belopp: -340, bankAccountId: "AA" },
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
