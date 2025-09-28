"use client";
import Aggregated from "./DataTabs/Aggregated";
import Transactions from "./DataTabs/Transactions";
import getUnique from "~/lib/utils/getUnique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TransactionFilter from "./DataTabs/TransactionFilter";
import applyTransactionFilters from "~/lib/utils/transactionFilter";
import type { FilterTab } from "~/types";
import CategoryPlots from "./DataTabs/CategoryPlots";
import Balance from "./DataTabs/Balance";
import { useStore } from "~/stores/tx-store";
import DateFilter from "./DateFilters/DateFilter";
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
