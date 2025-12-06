"use client";
import {
  Aggregated,
  Transactions,
  TransactionFilter,
  CategoryPlots,
  Balance,
  DateFilter,
  FiltersToggle,
} from "~/components/common";
import { getUnique, applyTransactionFilters } from "~/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import type { FilterTab } from "~/types";
import { useStore } from "~/stores/tx-store";
import type { FromTo } from "~/lib/zodSchemas";

type Props = { changeDates: (dates: FromTo) => Promise<void> };
const ShowData = ({ changeDates }: Props) => {
  const filter = useStore((state) => state.filter);
  const txSort = useStore((state) => state.txSort);
  const filterTab = useStore((state) => state.filterTab);
  const data = useStore((state) => state.txs);
  const { setFilterTab } = useStore();
  const txs = applyTransactionFilters({ data, filters: { filter, txSort } });
  const options = getUnique(data);

  return (
    <section className="flex flex-1 flex-col gap-2 pt-2 md:pt-0">
      <FiltersToggle />
      <DateFilter changeDates={changeDates} />
      <Tabs
        className="flex-1 min-h-0 md:gap-2 gap-0"
        value={filterTab}
        onValueChange={(value) => setFilterTab(value as FilterTab)}
      >
        <TabsList className="w-full md:w-fit">
          <TabsTrigger value="aggregated">Budget</TabsTrigger>
          <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
          <TabsTrigger value="categoryBars">Utgifter</TabsTrigger>
          <TabsTrigger value="balanceOverTime">Saldo</TabsTrigger>
        </TabsList>
        {filterTab !== "aggregated" && <TransactionFilter options={options} />}
        <TabsContent value="aggregated" className="flex-1 min-h-0">
          <Aggregated options={options} />
        </TabsContent>
        <TabsContent
          value="transactions"
          className="flex-1 min-h-0 flex flex-col"
        >
          <Transactions data={txs} changeDates={changeDates} />
        </TabsContent>
        <TabsContent value="categoryBars">
          <CategoryPlots data={txs} options={options} />
        </TabsContent>
        <TabsContent value="balanceOverTime">
          <Balance data={txs} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ShowData;
