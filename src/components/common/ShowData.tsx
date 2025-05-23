"use client";
import { type ReactNode } from "react";
import Aggregated from "./DataTabs/Aggregated";
import Transactions from "./DataTabs/Transactions";
import getUnique from "~/lib/utils/getUnique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TransactionFilter from "./DataTabs/TransactionFilter";
import applyTransactionFilters from "~/lib/utils/transactionFilter";
import type { Tx, Tab } from "~/types";
import CategoryBars from "./DataTabs/CategoryBars";
import Balance from "./DataTabs/Balance";
import { useTxFilterStore } from "~/stores/tx-filter-store";

type Props = {
  data: Tx[];
  loading?: boolean;
  children: ReactNode;
};
const ShowData = ({ data, loading = false, children }: Props) => {
  const { txFilter, txSort, tab, setTab } = useTxFilterStore();
  const txs = applyTransactionFilters({ data, filters: { txFilter, txSort } });
  const options = getUnique({ data, txFilter });

  return (
    <section className="flex h-full flex-col gap-2 p-2 md:gap-5">
      {children}
      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList>
          <TabsTrigger value="aggregated">Budget</TabsTrigger>
          <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
          <TabsTrigger value="categoryBars">Utgifter</TabsTrigger>
          <TabsTrigger value="balanceOverTime">Saldo</TabsTrigger>
        </TabsList>
        <TabsContent value="aggregated">
          {loading ? (
            <p>Laddar...</p>
          ) : (
            <Aggregated data={data} options={options.aggregated} />
          )}
        </TabsContent>
        <TabsContent value="transactions">
          {loading ? (
            <p>Laddar...</p>
          ) : (
            <>
              <TransactionFilter options={options.transactions} />
              <Transactions data={txs} />
            </>
          )}
        </TabsContent>
        <TabsContent value="categoryBars">
          {loading ? (
            <p>Laddar...</p>
          ) : (
            <>
              <TransactionFilter options={options.transactions} />
              <CategoryBars data={txs} options={options.aggregated} />
            </>
          )}
        </TabsContent>
        <TabsContent value="balanceOverTime">
          {loading ? (
            <p>Laddar...</p>
          ) : (
            <>
              <TransactionFilter options={options.transactions} />
              <Balance data={txs} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ShowData;
