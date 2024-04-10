"use client";
import { useState } from "react";
import DateFilter from "./DateFilter";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";

import getUnique from "~/lib/utils/getUnique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TransactionFilter from "./TransactionFilter";
import applyTransactionFilters, {
  getDefaultFilter,
} from "~/lib/utils/transactionFilter";

import type { TxFilter, TxSort } from "~/types";
import type { FromTo, Tx } from "~/lib/zodSchemas";

type Tab = "aggregated" | "transactions";

type Props = {
  data: Tx[];
  loading?: boolean;
  setDates: (dates: FromTo) => void;
  range: FromTo;
  defaultTab?: Tab;
};
const ShowData = ({
  range,
  data,
  loading = false,
  setDates,
  defaultTab = "aggregated",
}: Props) => {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const defaults = getDefaultFilter();
  const [txFilter, setTxFilter] = useState<TxFilter>(defaults.txFilter);
  const [txSort, setTxSort] = useState<TxSort>(defaults.txSort);
  const txs = applyTransactionFilters({ data, filters: { txFilter, txSort } });
  const options = getUnique({ data, txFilter });

  return (
    <section className="flex h-full flex-col gap-5 p-2">
      <DateFilter range={range} changeDates={(dates) => setDates(dates)} />
      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList>
          <TabsTrigger value="aggregated">Budget</TabsTrigger>
          <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
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
      </Tabs>
    </section>
  );
};

export default ShowData;
