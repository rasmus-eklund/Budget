import { it, describe, expect } from "bun:test";
import {
  filterChanged,
  type Part,
  resetFilter,
  transactionFilter,
} from "./transactionFilter";
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

const createFilter = (filter?: Partial<Filter>): Filter => ({
  person: { A: true, B: true },
  category: { mat: true, transport: true, inom: true },
  account: { A: true, B: true, C: true },
  search: { mode: "include", terms: [] },
  ...filter,
});

describe("Transaction filter", () => {
  it("should show all", () => {
    const filter = createFilter();
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(data);
  });

  it("should show only person A", () => {
    const filter = createFilter({
      person: { A: true, B: false },
    });
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
    const filter = createFilter({
      person: { A: true, B: false },
      category: { mat: true, transport: false, inom: false },
    });
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });

  it("should hide inom", () => {
    const filter = createFilter({
      category: { mat: true, transport: true, inom: false },
    });
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
    const filter = createFilter({
      person: { A: true, B: false },
      category: { mat: true, transport: true, inom: false },
    });
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });

  it("should show only person A and account A and hide inom", () => {
    const filter = createFilter({
      person: { A: true, B: false },
      category: { mat: true, transport: true, inom: false },
      account: { A: true, B: false, C: false },
    });
    const expected: Part[] = [
      { text: "", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });

  it("should include matching text terms", () => {
    const filter = createFilter({
      category: { mat: true, transport: true, inom: false },
      search: { mode: "include", terms: ["sl"] },
    });
    const expected: Part[] = [
      { text: "sl", person: "A", budgetgrupp: "transport", konto: "B" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });

  it("should include any matching text term case-insensitively", () => {
    const filter = createFilter({
      search: { mode: "include", terms: ["ICA", "coOP"] },
    });
    const groceries: Part[] = [
      { text: "Ica Kvantum", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "Coop", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "Willys", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = groceries.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(groceries.slice(0, 2));
  });

  it("should exclude any matching text term", () => {
    const filter = createFilter({
      search: { mode: "exclude", terms: ["willys"] },
    });
    const groceries: Part[] = [
      { text: "Ica Kvantum", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "Willys", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "Coop", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    const result = groceries.filter((d) => transactionFilter({ ...d, filter }));
    const expected: Part[] = [
      { text: "Ica Kvantum", person: "A", budgetgrupp: "mat", konto: "A" },
      { text: "Coop", person: "A", budgetgrupp: "mat", konto: "A" },
    ];
    expect(result).toEqual(expected);
  });

  it("should detect search changes", () => {
    const defaultFilter = createFilter();

    expect(
      filterChanged({
        defaultFilter,
        filter: createFilter({ search: { mode: "include", terms: ["ica"] } }),
      }),
    ).toBe(true);
    expect(
      filterChanged({
        defaultFilter,
        filter: createFilter({ search: { mode: "exclude", terms: [] } }),
      }),
    ).toBe(true);
  });

  it("should reset search terms and mode", () => {
    const filter = createFilter({
      category: { mat: true, transport: true, inom: true },
      search: { mode: "exclude", terms: ["ica"] },
    });

    expect(resetFilter(filter).search).toEqual({ mode: "include", terms: [] });
  });
});
