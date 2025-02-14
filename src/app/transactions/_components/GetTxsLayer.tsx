"use client";
import React, { useEffect, useState } from "react";
import ShowData from "~/components/common/ShowData";
import { type FromTo } from "~/lib/zodSchemas";
import { usePassword } from "~/components/password/PasswordContext";
import { getCurrentYearMonth } from "~/lib/utils/dateCalculations";
import getTxByDates from "../dataLayer/getData";
import type { Tx } from "~/types";
import DateFilter from "~/components/common/DateFilters/DateFilter";
import { useRouter } from "next/navigation";

type Props = { range: FromTo };
const GetTxsLayer = ({ range }: Props) => {
  const router = useRouter();
  const { password } = usePassword();
  const [loading, setLoading] = useState(true);
  const [txs, setData] = useState<Tx[]>([]);

  const getData = async (dates: FromTo) => {
    setLoading(true);
    const res = await getTxByDates({ dates, password });
    if (!res.ok) {
      setData([]);
      console.error(res.error);
      if (res.error === "password") {
        return router.push("/password?from=transactions&error=true");
      }
      console.error(res.error);
      return;
    }
    if (res.ok) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (password === "") {
      return router.push("/password?from=transactions");
    }
    const dates = getCurrentYearMonth();
    getTxByDates({ dates, password })
      .then((res) => {
        if (!res.ok) {
          return setData([]);
        }
        setData(res.data);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [password, router]);

  return (
    <ShowData loading={loading} data={txs}>
      <DateFilter range={range} changeDates={getData} />
    </ShowData>
  );
};

export default GetTxsLayer;
