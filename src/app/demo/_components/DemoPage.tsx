"use client";

import { getFromTo } from "~/lib/utils/dateCalculations";

import type { FromTo, Tx } from "~/lib/zodSchemas";
import { useState } from "react";
import { applyCategories } from "~/lib/utils/categorize";
import ShowData from "~/components/common/ShowData";
import DateFilter from "~/components/common/DateFilters/DateFilter";
import { categories } from "./_generateData/categories";
import { generateData } from "./_generateData/generateData";

const DemoPage = () => {
  const txs = generateData();
  const fromTo = getFromTo(txs);
  const [{ from, to }, setDates] = useState<FromTo>(fromTo);
  const data: Tx[] = [];
  for (const tx of txs) {
    if (tx.datum >= from && tx.datum <= to) {
      data.push(applyCategories({ tx, categories }));
    }
  }

  return (
    <ShowData data={data}>
      <DateFilter
        range={fromTo}
        changeDates={async (dates) => setDates(dates)}
      />
    </ShowData>
  );
};

export default DemoPage;
