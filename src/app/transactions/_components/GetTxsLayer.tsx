"use client";
import { useCallback, useEffect } from "react";
import { type FromTo } from "~/lib/zodSchemas";
import { getLastMonthYear } from "~/lib";
import getTxByDates from "../dataLayer/getData";
import { useStore } from "~/stores/tx-store";
import { emptyOptions } from "~/constants";
import { ShowData } from "~/components/common";

type Props = { range: FromTo; userId: string };
const GetTxsLayer = ({ range: { from, to }, userId }: Props) => {
  const setTxs = useStore((state) => state.setTxs);
  const setLoading = useStore((state) => state.setLoading);
  const setRange = useStore((state) => state.setRange);
  const password = useStore((state) => state.password);

  const getData = useCallback(
    async (dates: FromTo, reset = false) => {
      setLoading(true);
      try {
        const res = await getTxByDates({ dates, password, userId });
        setTxs(
          res.ok
            ? { txs: res.data, options: res.options, reset }
            : { txs: [], options: emptyOptions, reset: true },
        );
      } catch (e) {
        console.error(e);
        setTxs({ txs: [], options: emptyOptions, reset: true });
      } finally {
        setLoading(false);
      }
    },
    [setTxs, setLoading, password, userId],
  );

  useEffect(() => {
    const range = { from, to };
    setRange(range);
    const dates = getLastMonthYear(range);
    getData(dates, true);
  }, [setRange, from, to, getData]);

  return <ShowData changeDates={getData} />;
};

export default GetTxsLayer;
