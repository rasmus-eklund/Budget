"use client";
import { dateToString, toSek } from "~/lib/utils/formatData";
import { Virtuoso } from "react-virtuoso";
import type { Tx } from "~/types";
import capitalize from "~/lib/utils/capitalize";
import { cn } from "~/lib/utils";

type Props = { data: Tx[] };
const Transactions = ({ data }: Props) => {
  return (
    <>
      <Virtuoso
        className="flex-1 min-h-0"
        data={data}
        itemContent={(_, tx) => <Transaction key={tx.id} data={tx} />}
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
}: {
  data: Tx;
}) => {
  return (
    <li className="mb-2 mt-2 flex flex-col rounded-sm bg-accent p-1 shadow-lg">
      <div className="grid grid-cols-2">
        <p className="font-semibold">{dateToString(datum)}</p>
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
