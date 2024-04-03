"use client";
import { useState } from "react";
import DateFilter from "./DateFilter";
import Tabs from "~/components/common/Tabs";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";
import type { FromTo, Tx } from "~/lib/zodSchemas";
import getTxByDates from "../dataLayer/getData";
import { getCurrentYearMonth } from "~/lib/utils/datePicker";
import getUnique from "~/lib/utils/getUnique";

const PasswordLayer = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    success: boolean;
    data: Tx[];
    message: string;
  }>({ success: false, data: [], message: "Ange lösenord" });
  const options = getUnique(data.data);
  const handlePwSubmit = async (password: string, dates: FromTo) => {
    setLoading(true);
    setData(await getTxByDates({ dates, password }));
    setLoading(false);
  };
  return (
    <section className="flex h-full flex-col gap-5 p-2">
      <PasswordForm
        submitPassword={async (password) => {
          const dates = getCurrentYearMonth();
          setPassword(password);
          await handlePwSubmit(password, dates);
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
                <Aggregated
                  data={data.data}
                  options={options}
                  loading={loading}
                />
              ),
            },
            {
              name: "Transaktioner",
              tab: (
                <Transactions
                  data={data.data}
                  options={options}
                  loading={loading}
                />
              ),
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

export default PasswordLayer;
