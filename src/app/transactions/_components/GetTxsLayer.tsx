"use client";
import React, { useEffect } from "react";
import ShowData from "~/components/common/ShowData";
import { type FromTo } from "~/lib/zodSchemas";
import { getCurrentYearMonth } from "~/lib/utils/dateCalculations";
import getTxByDates from "../dataLayer/getData";
import { useRouter } from "next/navigation";
import { useStore } from "~/stores/tx-store";

type Props = { range: FromTo; userId: string };
const GetTxsLayer = ({ range, userId }: Props) => {
  const router = useRouter();
  const { setTxs, setLoading, setRange } = useStore();
  const password = useStore((state) => state.password);

  const getData = async (dates: FromTo) => {
    setLoading(true);
    const res = await getTxByDates({ dates, password, userId });
    if (!res.ok) {
      setTxs([]);
      setLoading(false);
      return;
    }
    setTxs(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const dates = getCurrentYearMonth();
    getTxByDates({ dates, password, userId })
      .then((res) => {
        if (!res.ok) {
          setTxs([]);
          setLoading(false);
          return;
        }
        setTxs(res.data);
        setRange(range);
      })
      .catch(() => setTxs([]))
      .finally(() => setLoading(false));
  }, [password, router, userId, setLoading, setTxs, setRange, range]);

  return <ShowData changeDates={getData} />;
};

export default GetTxsLayer;
