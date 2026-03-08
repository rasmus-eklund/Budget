"use client";
import { dateToString, toSek, capitalize, getDayRange } from "~/lib";
import { Virtuoso } from "react-virtuoso";
import type { Tx } from "~/types";
import { cn } from "~/lib/utils";
import { useStore } from "~/stores/tx-store";
import { MarkAsInternal } from "~/components/common";
import type { FromTo } from "~/lib/zodSchemas";

type Props = {
  data: Tx[];
  changeDates: (dates: FromTo) => Promise<void>;
  canMarkInternal: boolean;
};
const Transactions = ({ data, changeDates, canMarkInternal = true }: Props) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <Virtuoso
        className="flex-1 min-h-0"
        data={data}
        itemContent={(_, tx) => (
          <Transaction
            key={tx.id}
            data={tx}
            changeDates={changeDates}
            canMarkInternal={canMarkInternal}
          />
        )}
      />
      <ShowSum data={data} />
    </div>
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
  data,
  changeDates,
  canMarkInternal,
}: {
  data: Tx;
  changeDates: (dates: FromTo) => Promise<void>;
  canMarkInternal: boolean;
}) => {
  const setDateTab = useStore((state) => state.setDateTab);
  const { belopp, datum, budgetgrupp, person, konto, text } = data;
  return (
    <li className="mb-2 mt-2 flex items-center gap-2 rounded-sm bg-accent p-1 shadow-lg overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="grid grid-cols-2">
          <button
            className="cursor-pointer hover:scale-105 w-fit"
            onClick={async () => {
              setDateTab("day");
              const dates = getDayRange(dateToString(datum));
              await changeDates(dates);
            }}
          >
            <p className="font-semibold">{dateToString(datum)}</p>
          </button>
          <Sek sek={belopp} />
        </div>
        <div className="flex min-w-0 justify-between gap-2">
          <p className="min-w-0 flex-1 truncate pr-2 italic">
            {text} - {capitalize(budgetgrupp)}
          </p>
          <p className="shrink-0 whitespace-nowrap">
            {capitalize(person)} ({capitalize(konto)})
          </p>
        </div>
      </div>
      {canMarkInternal && (
        <MarkAsInternal tx={data} changeDates={changeDates} />
      )}
    </li>
  );
};

const Sek = ({ sek }: { sek: number }) => (
  <p className={cn("text-right font-mono", sek < 0 && "text-primary")}>
    {toSek(sek)}
  </p>
);

export default Transactions;
