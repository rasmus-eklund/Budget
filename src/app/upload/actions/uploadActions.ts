"use server";

import { markInternal } from "~/utils/findInternal";
import { type Tx } from "~/zodSchemas";
import parseTxs from "~/utils/parseTxs";
import { api } from "~/trpc/server";

export const upload = async (formData: FormData) => {
  const files = formData.getAll("files") as File[];
  if (files.length < 1) {
    throw new Error("No files provided");
  }
  const year = formData.get("year") as string | null;
  if (!year) {
    throw new Error("Year not provided");
  }
  const data: Tx[] = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const [person, konto_end] = file.name.split("_") as [string, string];
    const konto = konto_end.replace(".csv", "").replace("Ã¤", "ä");
    const txs = await parseTxs(buffer, person, konto);
    data.push(...txs);
  }
  const internal = markInternal(data);
  await api.txs.replaceYear.mutate({ txs: internal, year: Number(year) });
};
