"use client";

import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui";
import { FreeDay, Month, FreeDates, Year } from "~/components/common";
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
import { useDebounceCallback } from "usehooks-ts";

type Props = { changeDates: (dates: FromTo) => Promise<void> };
const DateFilter = ({ changeDates }: Props) => {
  const setDateTab = useStore((state) => state.setDateTab);
  const setDraftRange = useStore((state) => state.setDraftRange);
  const dateTab = useStore((state) => state.dateTab);
  const draftRange = useStore((state) => state.draftRange);
  const showDateFilter = useStore((state) => state.showDateFilter);
  const debouncedChangeDates = useDebounceCallback((dates: FromTo) => {
    void changeDates(dates);
  }, 500);
  const requestDateChange = (dates: FromTo) => {
    setDraftRange(dates);
    debouncedChangeDates(dates);
  };

  return (
    <Tabs
      value={dateTab}
      onValueChange={(value) => {
        const nextTab = value as DateTab;
        setDateTab(nextTab);
        const { from } = draftRange;
        if (nextTab === "free") return;

        if (nextTab === "day") {
          if (isSameDayRange(draftRange)) return;
          requestDateChange(getDayRange(dateToString(from)));
          return;
        }

        if (nextTab === "month") {
          if (isFullMonthRange(draftRange)) return;
          requestDateChange(
            getMonthRange({
              year: from.getFullYear(),
              month: from.getMonth() + 1,
            }),
          );
          return;
        }

        if (nextTab === "year") {
          if (isFullYearRange(draftRange)) return;
          requestDateChange({
            from: new Date(Date.UTC(from.getFullYear(), 0, 1)),
            to: new Date(Date.UTC(from.getFullYear() + 1, 0, 0)),
          });
        }
      }}
      className={cn("pt-2", showDateFilter ? "" : "hidden")}
    >
      <TabsList className="md:w-fit w-full">
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
