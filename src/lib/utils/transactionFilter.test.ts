import { it, describe, expect } from "bun:test";
import { type Part, transactionFilter } from "./transactionFilter";
import { type TxFilter } from "~/types";

const data: Part[] = [
  { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
  { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
  { text: "", person: "A", budgetgrupp: "inom", konto: "A" },
  { text: "", person: "A", budgetgrupp: "inom", konto: "C" },
  { text: "", person: "B", budgetgrupp: "mat", konto: "B" },
  { text: "", person: "B", budgetgrupp: "transport", konto: "A" },
  { text: "", person: "B", budgetgrupp: "inom", konto: "B" },
];

describe("Transaction filter", () => {
  it("should show all", () => {
    const filter: TxFilter = {
      category: ["mat", "transport", "inom"],
      person: ["A", "B"],
      account: ["A", "B", "C"],
      search: "",
    };
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(data);
  });
  it("should show only person A", () => {
    const filter: TxFilter = {
      category: ["mat", "transport", "inom"],
      person: ["A"],
      account: ["A", "B", "C"],
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
      { text: "", person: "A", budgetgrupp: "inom", konto: "A" },
      { text: "", person: "A", budgetgrupp: "inom", konto: "C" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show only person A and mat category", () => {
    const filter: TxFilter = {
      category: ["mat"],
      person: ["A"],
      account: ["A", "B", "C"],
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should hide inom", () => {
    const filter: TxFilter = {
      category: ["mat", "transport"],
      person: ["A", "B"],
      account: ["A", "B", "C"],
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
      { text: "", person: "B", budgetgrupp: "mat", konto: "B" },
      { text: "", person: "B", budgetgrupp: "transport", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show only person A and hide inom", () => {
    const filter: TxFilter = {
      category: ["mat", "transport"],
      person: ["A"],
      account: ["A", "B", "C"],
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show only person A and account A and hide inom", () => {
    const filter: TxFilter = {
      category: ["mat", "transport"],
      person: ["A"],
      account: ["A"],
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show sl", () => {
    const filter: TxFilter = {
      category: ["mat", "transport"],
      person: ["A", "B"],
      account: ["A", "B", "C"],
      search: "sl",
    };
    const expected: Part[] = [
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
});
