"use client";
import { type RouterOutputs } from "~/trpc/shared";
import { dateToString, toSek } from "~/utils/formatData";
import type { FromTo, Tx } from "~/zodSchemas";
import TransactionFilter from "./TransactionFilter";
import transactionFilter from "~/utils/transactionFilter";
import { useRouter } from "next/navigation";
import transactionSort from "~/utils/transactionSort";
import capitalize from "~/utils/capitalize";
import { useMemo } from "react";

type Props = { data: Tx };
type Data = {
  data: RouterOutputs["txs"]["getTxByDates"];
};

const Transactions = ({ data }: Data) => {
  const options = useMemo(() => {
    const people = new Set<string>();
    const categories = new Set<string>();
    const accounts = new Set<string>();
    data.forEach(({ person, budgetgrupp, konto }) => {
      people.add(person);
      categories.add(budgetgrupp);
      accounts.add(konto);
    });
    return {
      people: [...people],
      categories: [...categories],
      accounts: [...accounts],
    };
  }, [data]);
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
    <li className="bg-red-50 flex flex-col rounded-sm p-1 shadow-lg">
      <div className="grid grid-cols-2">
        <div>
          <button
            className="font-semibold"
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
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {text} - <i>{capitalize(budgetgrupp)}</i>
        </p>
        <p className="whitespace-nowrap">
          {person} ({konto})
        </p>
      </div>
    </li>
  );
};

export default Transactions;
