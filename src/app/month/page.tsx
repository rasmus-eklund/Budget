import { api } from "~/trpc/server";
import DateFilter from "./_components/DateFilter";
import Tabs from "../_components/Tabs";
import Aggregated from "./_components/Aggregated";
import parseSearch from "~/utils/parseUrlDates";
import Transactions from "./_components/Transactions";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

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
    <section className="flex h-full flex-col gap-5 pt-2">
      <DateFilter />
      <Tabs
        tabs={[
          {
            name: "Budget",
            tab: (
              <Aggregated
                data={data}
                categories={categories.map(({ namn }) => namn)}
              />
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

export default Month;
