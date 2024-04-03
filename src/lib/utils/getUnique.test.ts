import { it, describe, expect } from "vitest";
import getUnique from "./getUnique";

describe("getUnique", () => {
  it("returns unique people, categories, and accounts from data", () => {
    const data = [
      { person: "Alice", budgetgrupp: "Inkomst", konto: "Account1" },
      { person: "Bob", budgetgrupp: "Övrigt", konto: "Account2" },
      { person: "Bob", budgetgrupp: "Lån", konto: "Account2" },
      { person: "Alice", budgetgrupp: "Mat", konto: "Account3" },
      { person: "Alice", budgetgrupp: "Transport", konto: "Account1" },
    ];

    const result = getUnique(data);

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

  it("handles data with only one entry", () => {
    const data = [
      { person: "Alice", budgetgrupp: "Category1", konto: "Account1" },
    ];

    const result = getUnique(data);

    expect(result.people).toEqual(["Alice"]);
    expect(result.categories).toEqual(["Category1"]);
    expect(result.accounts).toEqual(["Account1"]);
  });
});
