import type { Tx } from "~/lib/zodSchemas";
import { categories } from "./categories";
import { getFromTo } from "~/lib/utils/dateCalculations";

export const generateData = () => {
  const txs: Tx[] = [];
  console.log("Generating data");
  const people = ["Anna", "Per"] as const;
  for (let year = 2020; year < 2024; year++) {
    const raise = getRandomFloat(1.01, 1.15);
    const salary = { Per: 22000 * raise, Anna: 17000 * raise } as const;
    for (let month = 0; month < 12; month++) {
      for (const person of people) {
        const firstDateOfMonth = new Date(year, month, 1);
        const spending = getSpending();
        const randomDates = getRandomDates(firstDateOfMonth, spending.length);
        for (let i = 0; i < randomDates.length; i++) {
          const datum = randomDates[i]!;
          const { belopp, text } = spending[i]!;
          const tx: Tx = {
            belopp,
            budgetgrupp: "övrigt",
            datum,
            id: "0",
            index: 0,
            konto: "Kort",
            person,
            saldo: 0,
            text,
            typ: "Korttransaktion",
          };
          txs.push(tx);
        }
        const income: Tx = {
          belopp: salary[person],
          budgetgrupp: "övrigt",
          datum: new Date(year, month, 25),
          id: "0",
          index: 0,
          konto: "Spar",
          person,
          saldo: 0,
          text: "Lön",
          typ: "Insättning",
        };
        txs.push(income);
        const rent: Tx = {
          belopp: -4000 * raise,
          budgetgrupp: "övrigt",
          datum: new Date(year, month + 1, 0),
          id: "0",
          index: 0,
          konto: "Spar",
          person,
          saldo: 0,
          text: "Hyra",
          typ: "Pg-Bg",
        };
        txs.push(rent);
      }
    }
  }
  txs.map((tx, i) => ({ ...tx, id: i.toString(), index: i }));
  const range = getFromTo(txs);
  if (!range) {
    throw new Error("No data");
  }
  return { range, txs };
};

const getRandomDates = (
  firstDateOfMonth: Date,
  numberOfDates: number,
): Date[] => {
  const dates: Date[] = [];

  const month = firstDateOfMonth.getMonth();
  const year = firstDateOfMonth.getFullYear();

  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < numberOfDates; i++) {
    const randomDay = Math.floor(Math.random() * lastDate) + 1;
    const randomDate = new Date(year, month, randomDay);
    dates.push(randomDate);
  }

  return dates;
};

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min: number, max: number): number => {
  const randomFloat = Math.random() * (max - min) + min;
  return parseFloat(randomFloat.toFixed(2));
};

const getSpending = () => {
  const spending: { text: string; belopp: number }[] = [];

  for (const { category, amt, nrs } of [
    { category: 0, amt: [-1000, -200], nrs: [3, 5] },
    { category: 1, amt: [-250, -25], nrs: [1, 2] },
    { category: 2, amt: [-1000, -400], nrs: [1, 1] },
    { category: 3, amt: [-500, -50], nrs: [2, 5] },
    { category: 4, amt: [-400, -50], nrs: [0, 2] },
  ] as const) {
    const categoryMatches = categories[category]!.match;
    const matchLength = categoryMatches.length;

    const nr = getRandomNumber(nrs[0], nrs[1]);
    for (let i = 0; i < nr; i++) {
      const amount = getRandomFloat(amt[0], amt[1]);
      const matchIndex = getRandomNumber(0, matchLength - 1);
      spending.push({
        text: categoryMatches[matchIndex]!.name,
        belopp: amount,
      });
    }
  }
  return spending;
};
