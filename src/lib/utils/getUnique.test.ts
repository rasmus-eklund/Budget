import { it, describe, expect } from "bun:test";
import getUnique from "./getUnique";

const data = [
  { person: "Alice", budgetgrupp: "Inkomst", konto: "Account1" },
  { person: "Bob", budgetgrupp: "Övrigt", konto: "Account2" },
  { person: "Bob", budgetgrupp: "Lån", konto: "Account2" },
  { person: "Alice", budgetgrupp: "Mat", konto: "Account3" },
  { person: "Alice", budgetgrupp: "Transport", konto: "Account1" },
];
describe("getUnique", () => {
  it("returns unique people, categories, and accounts from data", () => {
    const { transactions: result } = getUnique({
      data,
      txFilter: { person: "none", account: "none", category: "none" },
    });

    expect(result.people).toEqual(["Alice", "Bob"]);
    expect(result.categories).toEqual([
      "Inkomst",
      "Lån",
      "Mat",
      "Transport",
      "Övrigt",
    ]);
    expect(result.accounts).toEqual(["Account1", "Account2", "Account3"]);
  });
  it("returns unique people, categories, and accounts from data with person filter", () => {
    const { transactions: result } = getUnique({
      data,
      txFilter: { person: "Alice", account: "none", category: "none" },
    });

    expect(result.people).toEqual(["Alice", "Bob"]);
    expect(result.categories).toEqual(["Inkomst", "Mat", "Transport"]);
    expect(result.accounts).toEqual(["Account1", "Account3"]);
  });

  it("returns unique people, categories, and accounts from data with person and account filter", () => {
    const { transactions: result } = getUnique({
      data,
      txFilter: { person: "Alice", account: "Account1", category: "none" },
    });

    expect(result.people).toEqual(["Alice", "Bob"]);
    expect(result.categories).toEqual(["Inkomst", "Transport"]);
    expect(result.accounts).toEqual(["Account1", "Account3"]);
  });

  it("returns unique people, categories, and accounts from data with all filters", () => {
    const { transactions: result } = getUnique({
      data,
      txFilter: { person: "Alice", account: "Account1", category: "Inkomst" },
    });

    expect(result.people).toEqual(["Alice", "Bob"]);
    expect(result.categories).toEqual(["Inkomst", "Transport"]);
    expect(result.accounts).toEqual(["Account1"]);
  });

  it("returns unique people, categories, and accounts from data with all filters 2", () => {
    const { transactions: result } = getUnique({
      data,
      txFilter: { person: "Bob", account: "Account2", category: "Övrigt" },
    });

    expect(result.people).toEqual(["Alice", "Bob"]);
    expect(result.categories).toEqual(["Lån", "Övrigt"]);
    expect(result.accounts).toEqual(["Account2"]);
  });

  it("handles data with only one entry", () => {
    const one = data.slice(0, 1);
    const { transactions: result } = getUnique({
      data: one,
      txFilter: { person: "none", account: "none", category: "none" },
    });

    expect(result.people).toEqual(["Alice"]);
    expect(result.categories).toEqual(["Inkomst"]);
    expect(result.accounts).toEqual(["Account1"]);
  });
});
