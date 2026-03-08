"use client";
import {
  Aggregated,
  Transactions,
  TransactionFilter,
  CategoryPlots,
  Balance,
  DateFilter,
  FiltersToggle,
  Icon,
} from "~/components/common";
import { getUnique, applyTransactionFilters } from "~/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import type { FilterTab } from "~/types";
import { useStore } from "~/stores/tx-store";
import type { FromTo } from "~/lib/zodSchemas";

type Props = {
  changeDates: (dates: FromTo) => Promise<void>;
  canMarkInternal?: boolean;
};
const ShowData = ({ changeDates, canMarkInternal = true }: Props) => {
  const filter = useStore((state) => state.filter);
  const txSort = useStore((state) => state.txSort);
  const filterTab = useStore((state) => state.filterTab);
  const data = useStore((state) => state.txs);
  const setFilterTab = useStore((state) => state.setFilterTab);
  const txs = applyTransactionFilters({ data, filters: { filter, txSort } });
  const options = getUnique(data);

  return (
    <section className="flex flex-1 flex-col gap-2">
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
          <LoadingWrapper>
            <Aggregated options={options} />
          </LoadingWrapper>
        </TabsContent>
        <TabsContent value="transactions" className="flex-1 min-h-0 flex">
          <LoadingWrapper>
            <Transactions
              data={txs}
              changeDates={changeDates}
              canMarkInternal={canMarkInternal}
            />
          </LoadingWrapper>
        </TabsContent>
        <TabsContent value="categoryBars">
          <LoadingWrapper>
            <CategoryPlots data={txs} options={options} />
          </LoadingWrapper>
        </TabsContent>
        <TabsContent value="balanceOverTime">
          <LoadingWrapper>
            <Balance data={txs} />
          </LoadingWrapper>
        </TabsContent>
      </Tabs>
    </section>
  );
};

const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const loading = useStore((state) => state.loading);
  return (
    <div className="relative flex-1 min-h-0 flex">
      {children}
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center select-none bg-secondary/40 z-50">
          <Icon
            icon="Loader2Icon"
            className="animate-spin size-8 text-primary"
          />
        </div>
      )}
    </div>
  );
};

export default ShowData;

