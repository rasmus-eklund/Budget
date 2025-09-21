"use client";

import type { FromTo } from "~/lib/zodSchemas";
import { useEffect, useMemo } from "react";
import { applyCategory } from "~/lib/utils/categorize";
import ShowData from "~/components/common/ShowData";
import { categories } from "./_generateData/categories";
import { generateData } from "./_generateData/generateData";
import { useStore } from "~/stores/tx-store";
import { getLastMonthYear } from "~/lib/utils/dateCalculations";

const DemoPage = () => {
  const data = useMemo(() => {
    const { txs, range } = generateData();
    return { txs: txs.map((i) => applyCategory({ tx: i, categories })), range };
  }, []);

  const { setTxs, setRange } = useStore();

  const changeDates = async ({ from, to }: FromTo) =>
    setTxs(data.txs.filter((i) => i.datum >= from && i.datum <= to));

  useEffect(() => {
    setRange(data.range);
    const { from, to } = getLastMonthYear(data.range);
    setTxs(data.txs.filter((i) => i.datum >= from && i.datum <= to));
  }, [setRange, data.range, setTxs, data.txs]);

  return <ShowData changeDates={changeDates} />;
};

export default DemoPage;
