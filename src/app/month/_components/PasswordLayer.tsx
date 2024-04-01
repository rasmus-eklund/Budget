"use client";
import { Suspense, useState } from "react";
import DateFilter from "./DateFilter";
import Tabs from "~/components/common/Tabs";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";
import type { FromTo, Tx } from "~/lib/zodSchemas";
import getTxByDates from "../dataLayer/getData";

const PasswordLayer = () => {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<{
    success: boolean;
    data: Tx[];
    message: string;
  }>({ success: false, data: [], message: "Ange lösenord" });
  const handlePwSubmit = async (password: string, dates: FromTo) => {
    setData(await getTxByDates({ dates, password }));
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
              tab: (
                <Suspense fallback={<Loading />}>
                  <Aggregated data={data.data} />
                </Suspense>
              ),
            },
            {
              name: "Transaktioner",
              tab: <Transactions data={data.data} />,
            },
          ]}
        />
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

const Loading = () => {
  return <p>Laddar...</p>;
};

export default PasswordLayer;
