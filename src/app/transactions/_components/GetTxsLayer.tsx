"use client";
import React from "react";
import { useTxs } from "~/lib/hooks/useTxs";
import ShowData from "./ShowData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { range: FromTo };
const GetTxsLayer = ({ range }: Props) => {
  const { data, loading, setTxDate } = useTxs();
  if (!data.success) {
    if (data.message === "Fel lösenord") {
      return <p>Fel lösenord</p>;
    }
    return <p>Något gick fel</p>;
  }
  return (
    <ShowData
      loading={loading}
      data={data.data}
      setDates={(dates) => setTxDate(dates)}
      range={range}
    />
  );
};

export default GetTxsLayer;
