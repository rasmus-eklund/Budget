"use client";
import { useState } from "react";
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
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type Tab = "aggregated" | "transactions";

const PasswordLayer = () => {
  const [tab, setTab] = useState<Tab>("aggregated");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    setData(await getTxByDates({ dates, password }));
    setLoading(false);
  };
  const submitPassword = async (password: string) => {
    const dates = getCurrentYearMonth();
    setPassword(password);
    await getData(password, dates);
  };

  const applyFilters = () => {
    const txs = applyTransactionFilters({
      data: data.data,
      filters: { txFilter, txSort },
    });
    return <Transactions data={txs} loading={loading} />;
  };

  return (
    <section className="flex h-full flex-col gap-5 p-2">
      {data.message !== "Success" && (
        <PasswordForm submitPassword={submitPassword} />
      )}
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

type PasswordFormProps = { submitPassword: (password: string) => void };
const PasswordForm = ({ submitPassword }: PasswordFormProps) => {
  const [pw, setPw] = useState("");
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        submitPassword(pw);
      }}
    >
      <Label htmlFor="pw">Lösenord</Label>
      <Input
        type="password"
        name="password"
        id="pw"
        value={pw}
        onChange={({ target: { value } }) => setPw(value)}
      />
      <Button type="submit">Ok</Button>
    </form>
  );
};

export default PasswordLayer;
