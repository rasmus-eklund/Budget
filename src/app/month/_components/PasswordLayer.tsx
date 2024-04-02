"use client";
import { useState } from "react";
import DateFilter from "./DateFilter";
import Tabs from "~/components/common/Tabs";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";
import type { FromTo, Tx } from "~/lib/zodSchemas";
import getTxByDates from "../dataLayer/getData";

const PasswordLayer = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    success: boolean;
    data: Tx[];
    message: string;
  }>({ success: false, data: [], message: "Ange lösenord" });
  const handlePwSubmit = async (password: string, dates: FromTo) => {
    setLoading(true);
    setData(await getTxByDates({ dates, password }));
    setLoading(false);
  };

  return (
    <section className="flex h-full flex-col gap-5 p-2">
      <PasswordForm
        submitPassword={(password) => {
          setPassword(password);
          setData({ success: false, data: [], message: "Välj månad" });
        }}
      />
      {password ? (
        <DateFilter changeDates={(dates) => handlePwSubmit(password, dates)} />
      ) : null}
      {data.success ? (
        <Tabs
          tabs={[
            {
              name: "Budget",
              tab: <Aggregated data={data.data} loading={loading} />,
            },
            {
              name: "Transaktioner",
              tab: <TxsLoading data={data.data} loading={loading} />,
            },
          ]}
        />
      ) : (
        <p>{data.message}</p>
      )}
    </section>
  );
};

type TxsLoadingProps = { data: Tx[]; loading: boolean };
const TxsLoading = ({ data, loading }: TxsLoadingProps) => {
  if (loading) {
    return <p>Laddar...</p>;
  }
  return <Transactions data={data} />;
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
