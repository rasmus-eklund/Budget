import { readFileSync, readdirSync, writeFileSync } from "fs";
import categories from "../categories";
import { db } from "~/server/db";
import { type Tx} from "~/zodSchemas";
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
      const tmp = await parseTxs(buffer, person, konto)
      data.push(...tmp);
    }
  }
  return data;
};

const createPersonsAccounts = async (txs: Tx[], userId: string) => {
  const uniquePersons = [...new Set(txs.map(({ person }) => person))];
  for (const Person of uniquePersons) {
    const uniqueKonton = [
      ...new Set(
        txs.filter(({ person }) => person === Person).map((i) => i.konto),
      ),
    ];
    await db.person.create({
      data: {
        namn: Person,
        userId,
        Konto: { createMany: { data: uniqueKonton.map((i) => ({ namn: i })) } },
      },
    });
  }
};

const createTxs = async (txs: Tx[]) => {
  const persons = await db.person.findMany({
    include: { Konto: { select: { id: true, namn: true } } },
  });
  const data = txs.map(({ konto, person, saldo, belopp, ...rest }) => ({
    ...rest,
    saldo: saldo.toFixed(2),
    belopp: belopp.toFixed(2),
    kontoId: persons
      .find((p) => p.namn === person)!
      .Konto.find((k) => k.namn === konto)!.id,
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

// const categoriseTxs = async (userId: string) => {
//   const cats = await db.budgetgrupp.findMany({ where: { userId } });
//   for (const { matches, namn } of cats) {
//     await db.txs.updateMany({
//       where: {
//         AND: {
//           konto: { Person: { userId } },
//           OR: matches.map((match) => ({
//             text: { contains: match, mode: "insensitive" },
//           })),
//         },
//       },
//       data: { budgetgrupp: namn },
//     });
//   }
// };

const backupToFile = (txs: Tx[]) => {
  const backupPath = join(__dirname, "/../../backup/txs.json");
  writeFileSync(backupPath, JSON.stringify(txs, null, 2));
};

export const populateEverything = async () => {
  const userId = "clp6vujm80000xg1d7we59x2c";
  const txs = await readData();
  backupToFile(txs);
  await db.person.deleteMany();
  await createPersonsAccounts(txs, userId);
  await createTxs(txs);
  await createCategories(userId);
};
