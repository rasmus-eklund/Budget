"use client";
import React, { useEffect } from "react";
import { type FromTo } from "~/lib/zodSchemas";
import { getLastMonthYear } from "~/lib";
import getTxByDates from "../dataLayer/getData";
import { useRouter } from "next/navigation";
import { useStore } from "~/stores/tx-store";
import { emptyOptions } from "~/constants";
import { Spinner, ShowData } from "~/components/common";

type Props = { range: FromTo; userId: string };
const GetTxsLayer = ({ range, userId }: Props) => {
  const router = useRouter();
  const { setTxs, setLoading, setRange } = useStore();
  const password = useStore((state) => state.password);
  const loading = useStore((state) => state.loading);

  const getData = async (dates: FromTo) => {
    setLoading(true);
    const res = await getTxByDates({ dates, password, userId });
    setTxs(
      res.ok
        ? { txs: res.data, options: res.options }
        : { txs: [], options: emptyOptions },
    );
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const dates = getLastMonthYear(range);
    getTxByDates({ dates, password, userId })
      .then((res) => {
        setRange(range);
        setTxs(
          res.ok
            ? { txs: res.data, options: res.options, reset: true }
            : { txs: [], options: emptyOptions, reset: true },
        );
      })
      .catch((e) => {
        console.error(e);
        setTxs({ txs: [], options: emptyOptions, reset: true });
      })
      .finally(() => setLoading(false));
  }, [password, router, userId, setLoading, setTxs, setRange, range]);

  if (loading || !password) return <Spinner />;
  return <ShowData changeDates={getData} />;
};

export default GetTxsLayer;
