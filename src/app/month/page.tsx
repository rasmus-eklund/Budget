import { api } from "~/trpc/server";
import DateFilter from "./_components/DateFilter";
import Tabs from "../_components/Tabs";
import Aggregated from "./_components/Aggregated";
import { Suspense } from "react";
import parseSearch from "~/utils/parseUrlDates";
import { type RouterOutputs } from "~/trpc/shared";
import Transactions from "./_components/Transactions";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

type Data = {
  data: RouterOutputs["txs"]["getTxByDates"];
  categories: string[];
};

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};
const Month = async ({ searchParams }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const dates = parseSearch({ searchParams });
  const [data, categories] = await Promise.all([
    api.txs.getTxByDates.query(dates),
    api.categories.getAll.query(),
  ]);
  return (
    <section className="h-full">
      <DateFilter />
      <Tabs
        tabs={[
          {
            name: "Budget",
            tab: (
              <Suspense fallback={<p>Laddar...</p>}>
                <Budget
                  categories={categories.map(({ namn }) => namn)}
                  data={data}
                />
              </Suspense>
            ),
          },
          {
            name: "Transaktioner",
            tab: <Transactions data={data} />,
          },
        ]}
      />
    </section>
  );
};

const Budget = ({ categories, data }: Data) => {
  return (
    <div className="flex h-[calc(100%-40px)] flex-col gap-1 overflow-y-auto">
      <Suspense fallback={<p>Laddar...</p>}>
        <Aggregated data={data} categories={categories} />
      </Suspense>
    </div>
  );
};

export default Month;
