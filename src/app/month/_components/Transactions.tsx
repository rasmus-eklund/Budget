"use client";
import { dateToString, toSek } from "~/lib/utils/formatData";
import type { Tx } from "~/lib/zodSchemas";
import TransactionFilter from "./TransactionFilter";
import transactionFilter from "~/lib/utils/transactionFilter";
import transactionSort from "~/lib/utils/transactionSort";
import capitalize from "~/lib/utils/capitalize";
import type { TxFilter, TxSort, Uniques } from "~/types";

type Props = { data: Tx[]; options: Uniques; loading: boolean };

const Transactions = ({ data, options, loading }: Props) => {
  if (loading) {
    return <p>Laddar...</p>;
  }
  const applyTransactionFilters = ({
    data,
    filters: { txFilter, txSort },
  }: {
    data: Tx[];
    filters: { txFilter: TxFilter; txSort: TxSort };
  }) =>
    data
      .filter((d) => transactionFilter({ ...d, filter: txFilter }))
      .sort((a, b) => transactionSort(a, b, txSort));
  return (
    <TransactionFilter options={options}>
      {(filters) => (
        <ul className="flex flex-col gap-2">
          {applyTransactionFilters({ data, filters }).map((d) => (
            <Transaction key={d.id} data={d} />
          ))}
        </ul>
      )}
    </TransactionFilter>
  );
};

type TransactionProps = { data: Tx };

const Transaction = ({
  data: { belopp, datum, budgetgrupp, person, konto, text },
}: TransactionProps) => {
  return (
    <li className="flex flex-col rounded-sm bg-red-50 p-1 shadow-lg">
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
          {person} ({konto})
        </p>
      </div>
    </li>
  );
};

export default Transactions;
