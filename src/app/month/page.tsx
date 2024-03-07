import { api } from "~/trpc/server";
import DateFilter from "./components/DateFilter";
import Tabs from "../_components/Tabs";
import Transaction from "./components/Transaction";
import Aggregated from "./components/Aggregated";
import { Suspense } from "react";
import parseSearch from "~/utils/parseUrlDates";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};
const Month = ({ searchParams }: Props) => {
  const dates = parseSearch({ searchParams });
  return (
    <section className="h-full">
      <DateFilter />
      <Tabs
        tabs={[
          { name: "Budget", tab: <Budget dates={dates} /> },
          { name: "Transaktioner", tab: <Results dates={dates} /> },
        ]}
      />
    </section>
  );
};

type Dates = { dates: { from: Date; to: Date } };
const Results = async ({ dates }: Dates) => {
  const data = await api.txs.getTxByDates.query(dates);
  return (
    <Suspense fallback={<p>Laddar...</p>}>
      <ul className="flex h-[calc(100%-40px)] flex-col gap-1 overflow-y-auto">
        {data.map((d) => (
          <Transaction key={d.id} data={d} />
        ))}
      </ul>
    </Suspense>
  );
};

const Budget = async ({ dates }: Dates) => {
  const [data, categories] = await Promise.all([
    api.txs.getTxByDates.query(dates),
    api.txs.getCategories.query(),
  ]);

  return (
    <div className="flex h-[calc(100%-40px)] flex-col gap-1 overflow-y-auto">
      <Suspense fallback={<p>Laddar...</p>}>
        <Aggregated data={data} categories={categories} />
      </Suspense>
    </div>
  );
};

export default Month;
