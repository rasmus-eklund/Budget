"use client";
import { type RouterOutputs } from "~/trpc/shared";
import { dateToString, toSek } from "~/utils/formatData";
import { type Tx } from "~/zodSchemas";
import TransactionFilter from "./TransactionFilter";
import transactionFilter from "~/utils/transactionFilter";

type Props = { data: Tx };
type Data = {
  data: RouterOutputs["txs"]["getTxByDates"];
};

const Transactions = ({ data }: Data) => {
  const options = {
    people: [...new Set(data.map(({ person }) => person))],
    categories: [...new Set(data.map(({ budgetgrupp }) => budgetgrupp))],
  };

  return (
    <TransactionFilter options={options}>
      {({ txFilter, sortFilter }) => (
        <ul className="flex h-[calc(100%-40px)] flex-col gap-1 overflow-y-auto">
          {data
            .filter((d) => transactionFilter({ ...d, filter: txFilter }))
            .sort((a, b) => {
              if (sortFilter.belopp === "Datum (Lågt-Högt)") {
                return Number(a.datum) - Number(b.datum);
              }
              if (sortFilter.belopp === "Datum (Högt-Lågt)") {
                return Number(b.datum) - Number(a.datum);
              }
              if (sortFilter.belopp === "Belopp (Lågt-Högt)") {
                return a.belopp - b.belopp;
              }
              return b.belopp - a.belopp;
            })
            .map((d) => (
              <Transaction key={d.id} data={d} />
            ))}
        </ul>
      )}
    </TransactionFilter>
  );
};

const Transaction = ({
  data: { belopp, datum, budgetgrupp, person, konto, typ, text },
}: Props) => {
  return (
    <li className="flex flex-col bg-slate-200 p-1">
      <div className="grid grid-cols-2">
        <p>{dateToString(datum)}</p>
        <p className={`text-right font-mono ${belopp < 0 && "text-red"}`}>
          {toSek(belopp)}
        </p>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <p className="whitespace-nowrap">{text} - </p>
          <p>{budgetgrupp}</p>
        </div>
        <p>
          {person} ({konto}, {typ})
        </p>
      </div>
    </li>
  );
};

export default Transactions;
