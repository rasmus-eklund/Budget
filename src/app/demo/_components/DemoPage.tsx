"use client";

import type { FromTo } from "~/lib/zodSchemas";
import { useCallback, useEffect, useMemo } from "react";
import { applyCategory, getLastMonthYear } from "~/lib";
import { ShowData } from "~/components/common";
import { categories } from "./_generateData/categories";
import { generateData } from "./_generateData/generateData";
import { useStore } from "~/stores/tx-store";

const DemoPage = () => {
  const data = useMemo(() => {
    const { txs, range, options } = generateData();
    return {
      txs: txs.map((i) => applyCategory({ tx: i, categories })),
      range,
      options,
    };
  }, []);

  const setLoading = useStore((state) => state.setLoading);
  const setRange = useStore((state) => state.setRange);
  const setSelectedRange = useStore((state) => state.setSelectedRange);
  const setTxs = useStore((state) => state.setTxs);

  const getData = useCallback(
    async ({ from, to }: FromTo, reset = false) => {
      setSelectedRange({ from, to });
      setTxs({
        txs: data.txs.filter((i) => i.datum >= from && i.datum <= to),
        options: data.options,
        reset,
      });
    },
    [data.options, data.txs, setSelectedRange, setTxs],
  );

  const changeDates = async ({ from, to }: FromTo) => {
    await getData({ from, to });
  };

  useEffect(() => {
    setRange(data.range);
    const dates = getLastMonthYear(data.range);
    void getData(dates, true);
    setLoading(false);
  }, [setRange, data.range, getData, setLoading]);

  return <ShowData changeDates={changeDates} canMarkInternal={false} />;
};

export default DemoPage;

