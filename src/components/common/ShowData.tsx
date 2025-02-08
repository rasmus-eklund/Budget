"use client";
import { type ReactNode, useState } from "react";
import Aggregated from "./DataTabs/Aggregated";
import Transactions from "./DataTabs/Transactions";
import getUnique from "~/lib/utils/getUnique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TransactionFilter from "./DataTabs/TransactionFilter";
import applyTransactionFilters, {
  getDefaultFilter,
} from "~/lib/utils/transactionFilter";
import type { TxFilter, TxSort, Tx } from "~/types";
import dynamic from "next/dynamic";

const Bars = dynamic(() => import("./DataTabs/CategoryBars"), {
  ssr: false,
});
const Lines = dynamic(() => import("./DataTabs/Balance"), {
  ssr: false,
});

type Tab = "aggregated" | "transactions" | "categoryBars" | "balanceOverTime";

type Props = {
  data: Tx[];
  loading?: boolean;
  defaultTab?: Tab;
  children: ReactNode;
};
const ShowData = ({
  data,
  loading = false,
  defaultTab = "aggregated",
  children,
}: Props) => {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const defaults = getDefaultFilter();
  const [txFilter, setTxFilter] = useState<TxFilter>(defaults.txFilter);
  const [txSort, setTxSort] = useState<TxSort>(defaults.txSort);
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
            <Aggregated
              data={data}
              options={options.aggregated}
              setFilter={(filter) => {
                setTxFilter(filter);
                setTab("transactions");
              }}
            />
          )}
        </TabsContent>
        <TabsContent value="transactions">
          {loading ? (
            <p>Laddar...</p>
          ) : (
            <>
              <TransactionFilter
                options={options.transactions}
                defaults={defaults}
                filters={{ txFilter, txSort }}
                setFilters={{ setTxFilter, setTxSort }}
              />
              <Transactions data={txs} />
            </>
          )}
        </TabsContent>
        <TabsContent value="categoryBars">
          {loading ? (
            <p>Laddar...</p>
          ) : (
            <Bars data={txs} options={options.aggregated} />
          )}
        </TabsContent>
        <TabsContent value="balanceOverTime">
          {loading ? <p>Laddar...</p> : <Lines data={txs} />}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ShowData;
