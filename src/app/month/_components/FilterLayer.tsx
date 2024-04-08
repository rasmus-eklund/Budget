"use client";
import { useEffect, useState } from "react";
import DateFilter from "./DateFilter";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";
import type { FromTo } from "~/lib/zodSchemas";
import getTxByDates from "../dataLayer/getData";
import { getCurrentYearMonth } from "~/lib/utils/datePicker";
import getUnique from "~/lib/utils/getUnique";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import TransactionFilter from "./TransactionFilter";
import applyTransactionFilters from "~/lib/utils/transactionFilter";
import type { TxFilter, TxReturn, TxSort } from "~/types";
import { usePassword } from "~/app/_components/PasswordContext";

type Tab = "aggregated" | "transactions";

const FilterLayer = () => {
  const [tab, setTab] = useState<Tab>("aggregated");
  const [loading, setLoading] = useState(false);
  const { password, showDialog } = usePassword();
  const [data, setData] = useState<TxReturn>({
    success: false,
    data: [],
    message: "Fel lösenord",
  });
  const defaults: { txFilter: TxFilter; txSort: TxSort } = {
    txFilter: {
      category: "",
      person: "",
      account: "",
      inom: false,
      search: "",
    },
    txSort: { belopp: "Datum (Lågt-Högt)" },
  };
  const [txFilter, setTxFilter] = useState<TxFilter>(defaults.txFilter);
  const [txSort, setTxSort] = useState<TxSort>(defaults.txSort);
  const options = getUnique(data.data);

  const getData = async (password: string, dates: FromTo) => {
    setLoading(true);
    const res = await getTxByDates({ dates, password });
    setData(res);
    setLoading(false);
  };

  const applyFilters = () => {
    const txs = applyTransactionFilters({
      data: data.data,
      filters: { txFilter, txSort },
    });
    return <Transactions data={txs} loading={loading} />;
  };

  useEffect(() => {
    const dates = getCurrentYearMonth();
    getTxByDates({ password, dates })
      .then((data) => {
        setData(data);
        if (data.message === "Fel lösenord") {
          showDialog({ open: true });
        } else {
          showDialog({ open: false });
        }
      })
      .catch(() => {
        setData({ data: [], message: "Något gick fel", success: false });
      });
  }, [password, showDialog]);

  return (
    <section className="flex h-full flex-col gap-5 p-2">
      {password ? (
        <DateFilter changeDates={(dates) => getData(password, dates)} />
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
                setTxFilter(filter);
                setTab("transactions");
              }}
            />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionFilter
              options={options}
              defaults={defaults}
              filters={{ txFilter, txSort }}
              setFilters={{ setTxFilter, setTxSort }}
            />
            {applyFilters()}
          </TabsContent>
        </Tabs>
      ) : (
        <p>{data.message}</p>
      )}
    </section>
  );
};

export default FilterLayer;
