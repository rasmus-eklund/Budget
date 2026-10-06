"use client";

import { Temporal } from "@js-temporal/polyfill";
import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui";
import FreeDay from "./FreeDay";
import FreeDates from "./FreeDates";
import Month from "./Month";
import Year from "./Year";
import { useStore } from "~/stores/tx-store";
import type { DateTab } from "~/types";
import {
  cn,
  dateToString,
  getDayRange,
  getMonthRange,
  isFullMonthRange,
  isFullYearRange,
  isSameDayRange,
} from "~/lib";
import type { ChangeDates } from "~/types";

type Props = { changeDates: ChangeDates };
const DateFilter = ({ changeDates }: Props) => {
  const setDateTab = useStore((state) => state.setDateTab);
  const setDraftRange = useStore((state) => state.setDraftRange);
  const dateTab = useStore((state) => state.dateTab);
  const draftRange = useStore((state) => state.draftRange);
  const showDateFilter = useStore((state) => state.showDateFilter);

  const requestDateChange = (dates: FromTo) => {
    setDraftRange(dates);
    void changeDates(dates, { debounce: true });
  };

  return (
    <Tabs
      value={dateTab}
      onValueChange={(value) => {
        const nextTab = value as DateTab;
        setDateTab(nextTab);
        const { from } = draftRange;
        if (nextTab === "free") {
          return;
        }

        if (nextTab === "day") {
          if (isSameDayRange(draftRange)) {
            return;
          }
          requestDateChange(getDayRange(dateToString(from)));
          return;
        }

        if (nextTab === "month") {
          if (isFullMonthRange(draftRange)) {
            return;
          }
          requestDateChange(
            getMonthRange({
              year: from.year,
              month: from.month,
            }),
          );
          return;
        }

        if (isFullYearRange(draftRange)) {
          return;
        }
        requestDateChange({
          from: Temporal.PlainDate.from({ year: from.year, month: 1, day: 1 }),
          to: Temporal.PlainDate.from({ year: from.year, month: 12, day: 31 }),
        });
      }}
      className={cn("pt-2", showDateFilter ? "" : "hidden")}
    >
      <TabsList className="w-full md:w-fit">
        <TabsTrigger data-testid="date-tab-month" value="month">
          Månad
        </TabsTrigger>
        <TabsTrigger data-testid="date-tab-day" value="day">
          Dag
        </TabsTrigger>
        <TabsTrigger data-testid="date-tab-year" value="year">
          År
        </TabsTrigger>
        <TabsTrigger data-testid="date-tab-free" value="free">
          Fritt spann
        </TabsTrigger>
      </TabsList>
      <TabsContent value="month">
        <Month changeDate={requestDateChange} />
      </TabsContent>
      <TabsContent value="day">
        <FreeDay changeDate={requestDateChange} />
      </TabsContent>
      <TabsContent value="year">
        <Year changeDate={requestDateChange} />
      </TabsContent>
      <TabsContent value="free">
        <FreeDates changeDate={requestDateChange} />
      </TabsContent>
    </Tabs>
  );
};

export default DateFilter;
