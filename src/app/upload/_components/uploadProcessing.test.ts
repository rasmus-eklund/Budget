import { describe, expect, it } from "bun:test";
import type { TxBankAccount } from "~/lib/zodSchemas";
import {
  getUploadedAccountIds,
  getUploadYear,
  prepareFullReplaceTxs,
  prepareMergeTxs,
} from "./uploadProcessing";

const tx = ({
  account,
  amount,
  category = "övrigt",
  date = new Date("2025-01-10"),
  id,
}: {
  account: string;
  amount: number;
  category?: string;
  date?: Date;
  id: string;
}): TxBankAccount => ({
  bankAccountId: account,
  belopp: amount,
  budgetgrupp: category,
  datum: date,
  id,
  saldo: 0,
  text: id,
});

describe("upload processing", () => {
  it("marks full replace transactions using only uploaded files", () => {
    const data = prepareFullReplaceTxs([
      tx({ account: "a", amount: -100, id: "uploaded" }),
    ]);

    expect(data).toEqual([
      expect.objectContaining({ budgetgrupp: "övrigt", id: "uploaded" }),
    ]);
  });

  it("marks merge transactions using kept existing and uploaded files", () => {
    const data = prepareMergeTxs({
      existingTxs: [tx({ account: "b", amount: 100, id: "existing" })],
      uploadedTxs: [tx({ account: "a", amount: -100, id: "uploaded" })],
    });

    expect(data).toEqual([
      expect.objectContaining({ budgetgrupp: "inom", id: "existing" }),
      expect.objectContaining({ budgetgrupp: "inom", id: "uploaded" }),
    ]);
  });

  it("recalculates old internal labels during merge", () => {
    const data = prepareMergeTxs({
      existingTxs: [
        tx({
          account: "b",
          amount: 100,
          category: "inom",
          id: "old-internal",
        }),
      ],
      uploadedTxs: [tx({ account: "a", amount: -50, id: "uploaded" })],
    });

    expect(data.find(({ id }) => id === "old-internal")?.budgetgrupp).toBe(
      "övrigt",
    );
  });

  it("rejects uploads spanning multiple years", () => {
    expect(() =>
      getUploadYear([
        tx({ account: "a", amount: 1, date: new Date("2025-01-01"), id: "1" }),
        tx({ account: "a", amount: 1, date: new Date("2026-01-01"), id: "2" }),
      ]),
    ).toThrow("Ett år per uppladdning");
  });

  it("identifies unique uploaded account ids", () => {
    expect(
      getUploadedAccountIds([
        tx({ account: "a", amount: 1, id: "1" }),
        tx({ account: "a", amount: 2, id: "2" }),
        tx({ account: "b", amount: 3, id: "3" }),
      ]),
    ).toEqual(["a", "b"]);
  });
});
