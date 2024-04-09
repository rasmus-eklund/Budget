"use client";
import { useState } from "react";
import DateFilter from "./DateFilter";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";

import getUnique from "~/lib/utils/getUnique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TransactionFilter from "./TransactionFilter";
import applyTransactionFilters from "~/lib/utils/transactionFilter";

import { useTxs } from "~/lib/hooks/useTxs";

type Tab = "aggregated" | "transactions";

type Props = { years: number[] };
const FilterLayer = ({ years }: Props) => {
  const [tab, setTab] = useState<Tab>("aggregated");
  const { data, loading, filters } = useTxs();
  const options = getUnique(data.data);

  const txs = applyTransactionFilters({
    data: data.data,
    filters: filters.get,
  });

  return (
    <section className="flex h-full flex-col gap-5 p-2">
      {data.message !== "Fel lösenord" ? (
        <DateFilter
          years={years}
          changeDates={(dates) => filters.set.setTxDate(dates)}
        />
      ) : null}
      {data.success ? (
        <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
          <TabsList>
            <TabsTrigger value="aggregated">Budget</TabsTrigger>
            <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
          </TabsList>
          <TabsContent value="aggregated">
            <Aggregated
              data={data.data}
              options={options}
              loading={loading}
              setFilter={(filter) => {
                filters.set.setTxFilter(filter);
                setTab("transactions");
              }}
            />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionFilter
              options={options}
              defaults={filters.defaults}
              filters={filters.get}
              setFilters={filters.set}
            />
            <Transactions data={txs} loading={loading} />
          </TabsContent>
        </Tabs>
      ) : (
        <p>{data.message}</p>
      )}
    </section>
  );
};

export default FilterLayer;
