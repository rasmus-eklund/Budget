"use client";
import { api } from "~/trpc/react";
import DateFilter from "./components/DateFilter";
import Tabs from "../_components/Tabs";
import Transaction from "./components/Transaction";

const Month = () => {
  return (
    <section className="h-full">
      <DateFilter>
        {({ filter }) => (
          <Tabs
            tabs={[
              { name: "Budget", tab: <Budget dates={filter} /> },
              { name: "Transaktioner", tab: <Results dates={filter} /> },
            ]}
          />
        )}
      </DateFilter>
    </section>
  );
};

type Props = { dates: { from: Date; to: Date } };
const Results = ({ dates }: Props) => {
  const { data, isSuccess, isLoading } = api.txs.getTxByDates.useQuery(dates);
  return (
    <ul className="flex h-[calc(100%-40px)] flex-col gap-1 overflow-y-auto">
      {isSuccess && data.map((d) => <Transaction key={d.id} data={d} />)}
      {isLoading && <p>Laddar...</p>}
    </ul>
  );
};

const Budget = ({ dates }: Props) => {
  const { data, isSuccess, isLoading } = api.txs.getTxByDates.useQuery(dates);
  return (
    <ul className="flex h-[calc(100%-40px)] flex-col gap-1 overflow-y-auto">
      {isSuccess && <p>budget</p>}
      {isLoading && <p>Laddar...</p>}
    </ul>
  );
};

export default Month;
