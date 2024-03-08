import { it, describe, expect } from "vitest";
import transactionFilter from "./transactionFilter";
import { type TxFilter } from "~/types";

const data = [
  { person: "A", budgetgrupp: "mat" },
  { person: "A", budgetgrupp: "transport" },
  { person: "A", budgetgrupp: "inom" },
  { person: "B", budgetgrupp: "mat" },
  { person: "B", budgetgrupp: "transport" },
  { person: "B", budgetgrupp: "inom" },
];

describe("Transaction filter", () => {
  it("should show all", () => {
    const filter: TxFilter = { category: "", inom: true, person: "" };
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(data);
  });
  it("should show only person A", () => {
    const filter: TxFilter = { category: "", inom: true, person: "A" };
    const expected = [
      { person: "A", budgetgrupp: "mat" },
      { person: "A", budgetgrupp: "transport" },
      { person: "A", budgetgrupp: "inom" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show only person A and mat category", () => {
    const filter: TxFilter = { category: "mat", inom: true, person: "A" };
    const expected = [{ person: "A", budgetgrupp: "mat" }];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should hide inom", () => {
    const filter: TxFilter = { category: "", inom: false, person: "" };
    const expected = [
      { person: "A", budgetgrupp: "mat" },
      { person: "A", budgetgrupp: "transport" },
      { person: "B", budgetgrupp: "mat" },
      { person: "B", budgetgrupp: "transport" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
  it("should show only person A and hide inom", () => {
    const filter: TxFilter = { category: "", inom: false, person: "A" };
    const expected = [
      { person: "A", budgetgrupp: "mat" },
      { person: "A", budgetgrupp: "transport" },
    ];
    const result = data.filter((d) => transactionFilter({ ...d, filter }));
    expect(result).toEqual(expected);
  });
});
