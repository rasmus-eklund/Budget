"use client";
import React, { useEffect, useState } from "react";
import ShowData from "../../../components/common/ShowData";
import { type FromTo } from "~/lib/zodSchemas";
import { usePassword } from "~/components/password/PasswordContext";
import { getCurrentYearMonth } from "~/lib/utils/dateCalculations";
import getTxByDates from "../dataLayer/getData";
import { type TxReturn } from "~/types";
import DateFilter from "../../../components/common/DateFilters/DateFilter";
import { useRouter } from "next/navigation";

type Props = { range: FromTo };
const GetTxsLayer = ({ range }: Props) => {
  const router = useRouter();
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

  if (password === "") {
    router.push("/password?from=transactions");
    return null;
  }

  if (status === "Wrong password") {
    router.push("/password?from=transactions&error=true");
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
