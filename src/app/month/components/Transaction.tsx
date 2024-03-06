import React from "react";
import { type RouterOutputs } from "~/trpc/shared";
import { dateToString, toSek } from "~/utils/formatData";
type Data = RouterOutputs["txs"]["getTxByDates"][number];

type Props = { data: Data };

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

export default Transaction;
