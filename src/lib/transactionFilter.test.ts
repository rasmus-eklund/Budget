import { it, describe, expect } from "bun:test";
import { type Part, transactionFilter } from "./transactionFilter";
import { type Filter } from "~/types";

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
    const filter: Filter = {
      person: { A: true, B: true },
      category: { mat: true, transport: true, inom: true },
      account: { A: true, B: true, C: true },
      search: "",
    };
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(data);
  });
  it("should show only person A", () => {
    const filter: Filter = {
      person: { A: true, B: false },
      category: { mat: true, transport: true, inom: true },
      account: { A: true, B: true, C: true },
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
    const filter: Filter = {
      person: { A: true, B: false },
      category: { mat: true, transport: false, inom: false },
      account: { A: true, B: true, C: true },
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should hide inom", () => {
    const filter: Filter = {
      person: { A: true, B: true },
      category: { mat: true, transport: true, inom: false },
      account: { A: true, B: true, C: true },
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
    const filter: Filter = {
      person: { A: true, B: false },
      category: { mat: true, transport: true, inom: false },
      account: { A: true, B: true, C: true },
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
    const filter: Filter = {
      person: { A: true, B: false },
      category: { mat: true, transport: true, inom: false },
      account: { A: true, B: false, C: false },
      search: "",
    };
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show sl", () => {
    const filter: Filter = {
      person: { A: true, B: true },
      category: { mat: true, transport: true, inom: false },
      account: { A: true, B: true, C: true },
      search: "sl",
    };
    const expected: Part[] = [
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
});
