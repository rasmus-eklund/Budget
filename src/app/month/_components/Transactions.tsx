"use client";
import { type RouterOutputs } from "~/trpc/shared";
import { dateToString, toSek } from "~/utils/formatData";
import type { FromTo, Tx } from "~/zodSchemas";
import TransactionFilter from "./TransactionFilter";
import transactionFilter from "~/utils/transactionFilter";
import { useRouter } from "next/navigation";
import transactionSort from "~/utils/transactionSort";
import capitalize from "~/utils/capitalize";

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
        <ul className="flex flex-col gap-2">
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
    <li className="bg-red-50 flex flex-col rounded-sm p-1">
      <div className="grid grid-cols-2">
        <div>
          <button
            className="font-bold"
            onClick={() => changeDate({ from: datum, to: datum })}
          >
            {dateToString(datum)}
          </button>
        </div>
        <p className={`text-right font-mono ${belopp < 0 && "text-red-600"}`}>
          {toSek(belopp)}
        </p>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <p className="text-clip whitespace-nowrap">{text} - </p>
          <p>
            <i>{capitalize(budgetgrupp)}</i>
          </p>
        </div>
        <p>
          {person} ({konto})
        </p>
      </div>
    </li>
  );
};

export default Transactions;
