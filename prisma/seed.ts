import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse";
import { type Tx, txSchema } from "~/zodSchemas";
import { db } from "~/server/db";

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
      const raw = readFileSync(join(logsDir, year, personKonto));
      const tmp: Tx[] = [];
      await parse(raw, { delimiter: ";", from_line: 2 }).forEach(
        (row: [string, string, string, string, string, string]) => {
          const [date, text, typ, budgetgrupp, bel, sal] = row;
          const datum = new Date(date);
          const belopp = Number(
            bel.replace("kr", "").replace(",", ".").replace(" ", ""),
          );
          const saldo = Number(
            sal.replace("kr", "").replace(",", ".").replace(" ", ""),
          );
          const tx: Tx = {
            datum,
            text,
            typ,
            budgetgrupp,
            belopp,
            saldo,
            person,
            konto,
            index: 0,
          };
          const parsed = txSchema.safeParse(tx);
          if (!parsed.success) {
            throw new Error(parsed.error.message);
          }
          tmp.push(parsed.data);
        },
      );
      const tmpData = [...tmp.reverse().map((i, index) => ({ ...i, index }))];
      const reserved = tmpData.filter(({ typ }) => typ === "Reserverat Belopp");
      if (!!reserved) {
        reserved.forEach(({ belopp, index, datum }) => {
          const prev = tmpData[index - 1];
          if (!prev) {
            throw new Error(
              `Cannot iterpolate reserved for date: ${datum.toLocaleTimeString(
                "sv-SE",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                },
              )}, index: ${index}`,
            );
          }
          tmpData[index]!.saldo = prev.saldo + belopp;
        });
      }
      data.push(...tmpData);
    }
  }
  return data;
};

const backupToFile = (txs: Tx[]) => {
  const backupPath = join(__dirname, "/../backup/txs.json");
  writeFileSync(backupPath, JSON.stringify(txs, null, 2));
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

const main = async () => {
  const userId = "clp6vujm80000xg1d7we59x2c";
  const txs = await readData();
  backupToFile(txs);
  await db.person.deleteMany();
  await createPersonsAccounts(txs, userId);
  await createTxs(txs);
};

main().catch((err) => console.log(err));
