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
import type { TxReturn } from "~/types";

const PasswordLayer = () => {
  const [tab, setTab] = useState("aggregated");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TxReturn>({
    success: false,
    data: [],
    message: "Fel lösenord",
  });
  const options = getUnique(data.data);
  const getData = async (password: string, dates: FromTo) => {
    setLoading(true);
    setData(await getTxByDates({ dates, password }));
    setLoading(false);
  };

  return (
    <section className="flex h-full flex-col gap-5 p-2">
      {data.message !== "Success" && (
        <PasswordForm
          submitPassword={async (password) => {
            const dates = getCurrentYearMonth();
            setPassword(password);
            await getData(password, dates);
          }}
        />
      )}
      {password ? (
        <DateFilter changeDates={(dates) => getData(password, dates)} />
      ) : null}
      {data.success ? (
        <Tabs value={tab} onValueChange={(value) => setTab(value)}>
          <TabsList>
            <TabsTrigger value="aggregated">Budget</TabsTrigger>
            <TabsTrigger value="transactions">Transaktioner</TabsTrigger>
          </TabsList>
          <TabsContent value="aggregated">
            <Aggregated data={data.data} options={options} loading={loading} />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionFilter options={options}>
              {(filters) => {
                const txs = applyTransactionFilters({
                  data: data.data,
                  filters,
                });
                return <Transactions data={txs} loading={loading} />;
              }}
            </TransactionFilter>
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
      onSubmit={(e) => {
        e.preventDefault();
        submitPassword(pw);
      }}
    >
      <label htmlFor="pw">Lösenord</label>
      <input
        type="password"
        name="password"
        id="pw"
        value={pw}
        onChange={({ target: { value } }) => setPw(value)}
      />
      <button type="submit">Ok</button>
    </form>
  );
};

export default PasswordLayer;
