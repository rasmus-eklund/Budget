import type { Tx } from "~/lib/zodSchemas";
import { categories } from "./categories";

export const generateData = () => {
  const txs: Tx[] = [];
  const people = ["Anna", "Per"] as const;
  for (let year = 2020; year < 2024; year++) {
    const raise = getRandomFloat(1.01, 1.15);
    const salary = { Per: 24000 * raise, Anna: 17000 * raise } as const;
    for (let month = 0; month < 12; month++) {
      for (const person of people) {
        const firstDateOfMonth = new Date(year, month, 1);
        const numberOfDates = getRandomNumber(6, 12);
        const randomDates = getRandomDates(firstDateOfMonth, numberOfDates);
        for (const datum of randomDates) {
          const category = pickRandomNumberWithProbability(
            [0, 1, 2, 3, 4],
            [0.4, 0.1, 0.1, 0.2, 0.1],
          );
          const matches = categories[category]!.match;
          const match = getRandomNumber(0, matches.length - 1);
          const text = matches[match]!.name;
          const belopp = getRandomFloat(-2000, -20);
          const prefix = getRandomNumber(0, 1);

          const tx: Tx = {
            belopp,
            budgetgrupp: "övrigt",
            datum,
            id: "0",
            index: 0,
            konto: "Kort",
            person,
            saldo: 0,
            text: `${!!prefix ? "K*" : ""}${text}`,
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
  return txs;
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

const pickRandomNumberWithProbability = (
  numbers: number[],
  probabilities: number[],
): number => {
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < numbers.length; i++) {
    cumulativeProbability += probabilities[i]!;
    if (randomValue <= cumulativeProbability) {
      return numbers[i]!;
    }
  }
  return numbers[numbers.length - 1]!;
};
