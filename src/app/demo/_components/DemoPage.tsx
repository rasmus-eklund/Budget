"use client";

import type { FromTo } from "~/lib/zodSchemas";
import { useEffect, useMemo } from "react";
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

  const { setTxs, setRange, setLoading } = useStore();

  const changeDates = async ({ from, to }: FromTo) =>
    setTxs({
      txs: data.txs.filter((i) => i.datum >= from && i.datum <= to),
      options: data.options,
    });

  useEffect(() => {
    setRange(data.range);
    const { from, to } = getLastMonthYear(data.range);
    setTxs({
      txs: data.txs.filter((i) => i.datum >= from && i.datum <= to),
      options: data.options,
      reset: true,
    });
    setLoading(false);
  }, [setRange, data.range, setTxs, data.txs, data.options]);

  return <ShowData changeDates={changeDates} />;
};

export default DemoPage;
