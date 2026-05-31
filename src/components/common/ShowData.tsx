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
  Monthly,
} from "~/components/common";
import { getUnique, applyTransactionFilters } from "~/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import type { ChangeDates, FilterTab } from "~/types";
import { useStore } from "~/stores/tx-store";

type Props = {
  changeDates: ChangeDates;
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
    <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <FiltersToggle />
      <DateFilter changeDates={changeDates} />
      <Tabs
        className="min-h-0 min-w-0 flex-1 gap-0 md:gap-2"
        value={filterTab}
        onValueChange={(value) => setFilterTab(value as FilterTab)}
      >
        <TabsList className="w-full md:w-fit">
          <TabsTrigger value="aggregated">Budget</TabsTrigger>
          <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
          <TabsTrigger value="monthly">Perioder</TabsTrigger>
          <TabsTrigger value="categoryBars">Utgifter</TabsTrigger>
          <TabsTrigger value="balanceOverTime">Saldo</TabsTrigger>
        </TabsList>
        {filterTab !== "aggregated" && <TransactionFilter options={options} />}
        <TabsContent value="aggregated" className="min-h-0 min-w-0 flex-1">
          <LoadingWrapper>
            <Aggregated options={options} />
          </LoadingWrapper>
        </TabsContent>
        <TabsContent
          value="transactions"
          className="flex min-h-0 min-w-0 flex-1"
        >
          <LoadingWrapper>
            <Transactions
              data={txs}
              changeDates={changeDates}
              canMarkInternal={canMarkInternal}
            />
          </LoadingWrapper>
        </TabsContent>
        <TabsContent value="monthly" className="flex min-h-0 min-w-0 flex-1">
          <LoadingWrapper>
            <Monthly data={txs} options={options} />
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
    <div className="relative flex min-h-0 min-w-0 flex-1">
      {children}
      {loading && (
        <div className="absolute top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center bg-secondary/40 select-none">
          <Icon
            icon="Loader2Icon"
            className="size-8 animate-spin text-primary"
          />
        </div>
      )}
    </div>
  );
};

export default ShowData;
