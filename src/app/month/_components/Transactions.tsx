"use client";
import { type RouterOutputs } from "~/trpc/shared";
import { dateToString, toSek } from "~/utils/formatData";
import type { FromTo, Tx } from "~/zodSchemas";
import TransactionFilter from "./TransactionFilter";
import transactionFilter from "~/utils/transactionFilter";
import { useRouter } from "next/navigation";
import transactionSort from "~/utils/transactionSort";

type Props = { data: Tx };
type Data = {
  data: RouterOutputs["txs"]["getTxByDates"];
};

const Transactions = ({ data }: Data) => {
  const options = {
    people: [...new Set(data.map(({ person }) => person))],
    categories: [...new Set(data.map(({ budgetgrupp }) => budgetgrupp))],
    accounts: [...new Set(data.map(({ konto }) => konto))],
  };
  return (
    <TransactionFilter options={options}>
      {({ txFilter, sortFilter }) => (
        <ul className="flex flex-col gap-1">
          {data
            .filter((d) => transactionFilter({ ...d, filter: txFilter }))
            .sort((a, b) => transactionSort(a, b, sortFilter))
            .map((d) => (
              <Transaction key={d.id} data={d} />
            ))}
        </ul>
      )}
    </TransactionFilter>
  );
};

const Transaction = ({
  data: { belopp, datum, budgetgrupp, person, konto, text },
}: Props) => {
  const router = useRouter();
  const changeDate = ({ from, to }: FromTo) => {
    router.push(`/month/?from=${dateToString(from)}&to=${dateToString(to)}`);
  };
  return (
    <li className="flex flex-col rounded-sm bg-black/20 p-1">
      <div className="grid grid-cols-2">
        <div>
          <button
            className="underline"
            onClick={() => changeDate({ from: datum, to: datum })}
          >
            {dateToString(datum)}
          </button>
        </div>
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
          {person} ({konto})
        </p>
      </div>
    </li>
  );
};

export default Transactions;
