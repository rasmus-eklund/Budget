"use client";
import React, { useEffect, useState } from "react";
import ShowData from "../../../components/common/ShowData";
import { type FromTo } from "~/lib/zodSchemas";
import { usePassword } from "~/components/password/PasswordContext";
import { getCurrentYearMonth } from "~/lib/utils/dateCalculations";
import getTxByDates from "../dataLayer/getData";
import { type TxReturn } from "~/types";
import Link from "next/link";
import DateFilter from "../../../components/common/DateFilters/DateFilter";

type Props = { range: FromTo };
const GetTxsLayer = ({ range }: Props) => {
  const { password } = usePassword();
  const [loading, setLoading] = useState(true);
  const [{ data, status }, setData] = useState<TxReturn>({
    data: [],
    status: "Success",
  });
  const getData = async (dates: FromTo) => {
    setLoading(true);
    const txs = await getTxByDates({ dates, password });
    setData(txs);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getTxByDates({ dates: getCurrentYearMonth(), password })
      .then((txs) => {
        setData(txs);
        setLoading(false);
      })
      .catch(() => setData({ data: [], status: "Error" }));
  }, [password]);

  if (status === "Wrong password") {
    return (
      <p className="p-4">
        Fel eller inget lösenord.{" "}
        <span>
          <Link href={"/password?from=transactions"} className="underline">
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
    <ShowData loading={loading} data={data}>
      <DateFilter range={range} changeDates={getData} />
    </ShowData>
  );
};

export default GetTxsLayer;
