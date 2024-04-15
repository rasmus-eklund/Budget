"use client";
import { dateToString, toSek } from "~/lib/utils/formatData";
import { Virtuoso } from "react-virtuoso";
import type { Tx } from "~/lib/zodSchemas";
import capitalize from "~/lib/utils/capitalize";

type Props = { data: Tx[] };

const Transactions = ({ data }: Props) => {
  return (
    <ul className="flex flex-col gap-2">
      <Virtuoso
        className="!h-[500px]"
        data={data}
        itemContent={(_, tx) => <Transaction key={tx.id} data={tx} />}
      />
    </ul>
  );
};

type TransactionProps = { data: Tx };

const Transaction = ({
  data: { belopp, datum, budgetgrupp, person, konto, text },
}: TransactionProps) => {
  return (
    <li className="mb-2 mt-2 flex flex-col rounded-sm bg-red-50 p-1 shadow-lg">
      <div className="grid grid-cols-2">
        <div>
          <p className="font-semibold">{dateToString(datum)}</p>
        </div>
        <p className={`text-right font-mono ${belopp < 0 && "text-red-600"}`}>
          {toSek(belopp)}
        </p>
      </div>
      <div className="flex justify-between gap-2">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {text} - <i>{capitalize(budgetgrupp)}</i>
        </p>
        <p className="whitespace-nowrap">
          {capitalize(person)} ({capitalize(konto)})
        </p>
      </div>
    </li>
  );
};

export default Transactions;
