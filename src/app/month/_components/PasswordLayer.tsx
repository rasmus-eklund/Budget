"use client";
import { useState } from "react";
import DateFilter from "./DateFilter";
import Tabs from "~/components/common/Tabs";
import Aggregated from "./Aggregated";
import Transactions from "./Transactions";
import { FromTo, Tx } from "~/lib/zodSchemas";
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
    <div>
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
              tab: <Aggregated data={data.data} />,
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
    </div>
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
