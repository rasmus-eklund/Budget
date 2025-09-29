"use client";
import { dateToString, toSek, capitalize, getDayRange } from "~/lib";
import { Virtuoso } from "react-virtuoso";
import type { Tx } from "~/types";
import { cn } from "~/lib/utils";
import { Spinner } from "~/components/common";
import { useStore } from "~/stores/tx-store";
import type { FromTo } from "~/lib/zodSchemas";

type Props = { data: Tx[]; changeDates: (dates: FromTo) => Promise<void> };
const Transactions = ({ data, changeDates }: Props) => {
  const loading = useStore((state) => state.loading);
  if (loading) return <Spinner />;
  return (
    <>
      <Virtuoso
        className="flex-1 min-h-0"
        data={data}
        itemContent={(_, tx) => (
          <Transaction key={tx.id} data={tx} changeDates={changeDates} />
        )}
      />
      <ShowSum data={data} />
    </>
  );
};

const ShowSum = ({ data }: { data: Tx[] }) => {
  const sum = data.reduce((a, b) => a + b.belopp, 0);
  return (
    <div className="flex items-center justify-between gap-4 p-4 font-mono md:justify-end h-12 bg-secondary border-t">
      <p className="pl-2">Antal: {data.length}</p>
      <div className="flex items-center gap-2">
        <p>Totalt:</p>
        <Sek sek={sum} />
      </div>
    </div>
  );
};

const Transaction = ({
  data: { belopp, datum, budgetgrupp, person, konto, text },
  changeDates,
}: {
  data: Tx;
  changeDates: (dates: FromTo) => Promise<void>;
}) => {
  return (
    <li className="mb-2 mt-2 flex flex-col rounded-sm bg-accent p-1 shadow-lg">
      <div className="grid grid-cols-2">
        <button
          className="cursor-pointer hover:scale-105 w-fit"
          onClick={async () => changeDates(getDayRange(dateToString(datum)))}
        >
          <p className="font-semibold">{dateToString(datum)}</p>
        </button>
        <Sek sek={belopp} />
      </div>
      <div className="flex justify-between gap-2">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap pr-2 italic">
          {text} - {capitalize(budgetgrupp)}
        </p>
        <p className="whitespace-nowrap">
          {capitalize(person)} ({capitalize(konto)})
        </p>
      </div>
    </li>
  );
};

const Sek = ({ sek }: { sek: number }) => (
  <p className={cn("text-right font-mono", sek < 0 && "text-primary")}>
    {toSek(sek)}
  </p>
);

export default Transactions;
