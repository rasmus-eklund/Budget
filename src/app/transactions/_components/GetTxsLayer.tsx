"use client";
import React, { useEffect, useState } from "react";
import ShowData from "./ShowData";
import { type FromTo } from "~/lib/zodSchemas";
import { usePassword } from "~/app/_components/PasswordContext";
import { getCurrentYearMonth } from "~/lib/utils/datePicker";
import getTxByDates from "../dataLayer/getData";
import { type TxReturn } from "~/types";
import Link from "next/link";

type Props = { range: FromTo };
const GetTxsLayer = ({ range }: Props) => {
  const { password } = usePassword();
  const [txDate, setTxDate] = useState<FromTo>(getCurrentYearMonth());
  const [loading, setLoading] = useState(false);
  const [{ data, status }, setData] = useState<TxReturn>({
    data: [],
    status: "Success",
  });

  useEffect(() => {
    setLoading(true);
    getTxByDates({ dates: txDate, password })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setData({ data: [], status: "Error" }));
  }, [password, txDate]);

  if (status === "Wrong password") {
    return (
      <p>
        Fel lösenord.{" "}
        <span>
          <Link href={"/password"} className="underline">
            Ändra till rätt lösenord
          </Link>
        </span>
        .
      </p>
    );
  }
  if (status === "Error") {
    return <p>Något gick fel</p>;
  }

  return (
    <ShowData
      loading={loading}
      data={data}
      setDates={async (dates) => setTxDate(dates)}
      range={range}
    />
  );
};

export default GetTxsLayer;
