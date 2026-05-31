import { describe, expect, it } from "bun:test";
import { aggregateByPeriod } from "./Periods";
import type { Tx } from "~/types";

const tx = (datum: Date): Tx => ({
  id: crypto.randomUUID(),
  datum,
  text: "test",
  budgetgrupp: "food",
  belopp: 1,
  saldo: 1,
  konto: "account",
  person: "person",
});

describe("aggregateByPeriod", () => {
  it("groups local midnight dates by their local month", () => {
    const result = aggregateByPeriod({
      data: [tx(new Date(2020, 0, 1))],
      groupBy: "month",
      people: ["person"],
      categories: ["food"],
    });

    expect(result.map(({ period }) => period)).toEqual(["2020-01"]);
  });
});
