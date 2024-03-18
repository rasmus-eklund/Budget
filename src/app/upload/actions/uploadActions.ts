"use server";

import { markInternal } from "~/utils/findInternal";
import { type Tx } from "~/zodSchemas";
import { randomUUID } from "crypto";
import parseTxs from "~/utils/parseTxs";

export const upload = async (formData: FormData) => {
  const files = formData.getAll("files") as File[];
  const data: Tx[] = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const [person, konto] = file.name.split("_") as [string, string];
    const txs = await parseTxs(buffer, person, konto);
    data.push(...txs);
  }
  const internal = markInternal(
    data.map((i) => ({ ...i, budgetgrupp: "övrigt", id: randomUUID() })),
  );
  console.log(internal);
};
