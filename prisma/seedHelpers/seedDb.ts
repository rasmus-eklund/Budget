import { readFileSync, readdirSync, writeFileSync } from "fs";
import categories from "../../backup/categories";
import { db } from "~/server/db";
import { type Tx } from "~/zodSchemas";
import { join } from "path";
import parseTxs from "~/utils/parseTxs";

const logsDir = "C:/Users/rasmu/Dropbox/BudgetPython/logs";

const readData = async () => {
  const years = readdirSync(logsDir);
  const data: Tx[] = [];
  for (const year of years) {
    const personKonton = readdirSync(join(logsDir, year));
    for (const personKonto of personKonton) {
      const [person, konto] = personKonto.replace(".csv", "").split("_") as [
        string,
        string,
      ];
      const buffer = readFileSync(join(logsDir, year, personKonto));
      const tmp = await parseTxs(buffer, person, konto);
      data.push(...tmp);
    }
  }
  return data;
};

const createTxs = async (txs: Tx[], kontoId: string) => {
  const data = txs.map(({ saldo, belopp, ...rest }) => ({
    ...rest,
    saldo: saldo.toFixed(2),
    belopp: belopp.toFixed(2),
    kontoId,
  }));
  await db.txs.createMany({ data });
};

const createCategories = async (userId: string) => {
  await Promise.all(
    categories.map(({ key, values }) =>
      db.budgetgrupp.create({
        data: {
          namn: key,
          matches: { createMany: { data: values.map((namn) => ({ namn })) } },
          userId,
        },
      }),
    ),
  );
};

const backupToFile = (txs: Tx[]) => {
  const backupPath = join(__dirname, "/../../backup/txs.json");
  writeFileSync(backupPath, JSON.stringify(txs, null, 2));
};

export const populateEverything = async () => {
  const userId = "clp6vujm80000xg1d7we59x2c";
  const txs = await readData();
  backupToFile(txs);
  await createTxs(txs, userId);
  await createCategories(userId);
};
