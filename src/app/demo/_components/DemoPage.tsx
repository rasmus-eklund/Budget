"use client";

import type { FromTo } from "~/lib/zodSchemas";
import type { Tx } from "~/types";
import { useMemo, useState } from "react";
import { applyCategory } from "~/lib/utils/categorize";
import ShowData from "~/components/common/ShowData";
import DateFilter from "~/components/common/DateFilters/DateFilter";
import { categories } from "./_generateData/categories";
import { generateData } from "./_generateData/generateData";

const DemoPage = () => {
  const { txs, range } = useMemo(() => generateData(), []);
  const fromTo = { from: new Date("2023-12-01"), to: new Date("2023-12-31") };
  const [{ from, to }, setDates] = useState<FromTo>(fromTo);
  const data: Tx[] = [];
  for (const tx of txs) {
    if (tx.datum >= from && tx.datum <= to) {
      data.push(applyCategory({ tx, categories }));
    }
  }

  return (
    <ShowData data={data}>
      <DateFilter
        range={range}
        changeDates={async (dates) => setDates(dates)}
      />
    </ShowData>
  );
};

export default DemoPage;
