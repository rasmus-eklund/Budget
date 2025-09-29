import type { Tx } from "~/types";
import { categories } from "./categories";
import { getFromTo } from "~/lib";

export const generateData = () => {
  const txs: Tx[] = [];
  console.log("Generating data");
  const people = ["Anna", "Per"] as const;
  const balance = {
    Anna: { Kort: 10000, Spar: 40000 },
    Per: { Kort: 10000, Spar: 40000 },
  };
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
          if (balance[person].Kort < Math.abs(belopp)) {
            const [from, to] = internal({
              belopp,
              datum,
              kortBalance: balance[person].Kort,
              person,
              sparBalance: balance[person].Spar,
            });
            balance[person].Kort = to.saldo;
            balance[person].Spar = from.saldo;
            txs.push(from);
            txs.push(to);
          }
          balance[person].Kort += belopp;
          const tx: Tx = {
            belopp,
            budgetgrupp: "övrigt",
            datum,
            id: "0",
            konto: "Kort",
            person,
            saldo: balance[person].Kort,
            text,
          };
          txs.push(tx);
        }
        balance[person].Spar += salary[person];
        const income: Tx = {
          belopp: salary[person],
          budgetgrupp: "övrigt",
          datum: new Date(year, month, 25),
          id: "0",
          konto: "Spar",
          person,
          saldo: balance[person].Spar,
          text: "Lön",
        };
        txs.push(income);
        const belopp = -4000 * raise;
        balance[person].Spar += belopp;
        const rent: Tx = {
          belopp,
          budgetgrupp: "övrigt",
          datum: new Date(year, month + 1, 0),
          id: "0",
          konto: "Spar",
          person,
          saldo: balance[person].Spar,
          text: "Hyra",
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
  return {
    range,
    txs,
    options: {
      category: {
        ...Object.fromEntries(categories.map((i) => [i.name, true])),
        inkomst: true,
        övrigt: true,
        inom: false,
      },
      person: Object.fromEntries(["Per", "Anna"].map((i) => [i, true])),
      account: Object.fromEntries(["Kort", "Spar"].map((a) => [a, true])),
      search: "",
    },
  };
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

type Internal = {
  person: string;
  belopp: number;
  kortBalance: number;
  sparBalance: number;
  datum: Date;
};
const internal = (i: Internal): [Tx, Tx] => {
  const { person, datum } = i;
  const belopp = getRandomNumber(i.belopp, i.belopp * 10);
  const from: Tx = {
    belopp,
    budgetgrupp: "inom",
    datum,
    id: "0",
    konto: "Spar",
    person,
    saldo: i.sparBalance + belopp,
    text: "Överföring",
  };
  const to: Tx = {
    belopp: -belopp,
    budgetgrupp: "inom",
    datum,
    id: "0",
    konto: "Kort",
    person,
    saldo: i.kortBalance + -belopp,
    text: "Överföring Till Ica Banks Konto",
  };
  return [from, to];
};
