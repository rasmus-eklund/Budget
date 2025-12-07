"use client";

import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui";
import { FreeDay, Month, FreeDates, Year } from "~/components/common";
import { useStore } from "~/stores/tx-store";
import type { DateTab } from "~/types";
import { cn } from "~/lib";

type Props = { changeDates: (dates: FromTo) => Promise<void> };
const DateFilter = ({ changeDates }: Props) => {
  const setDateTab = useStore((state) => state.setDateTab);
  const dateTab = useStore((state) => state.dateTab);
  const showDateFilter = useStore((state) => state.showDateFilter);
  return (
    <Tabs
      value={dateTab}
      onValueChange={(value) => setDateTab(value as DateTab)}
      className={cn("pt-2", showDateFilter ? "" : "hidden")}
    >
      <TabsList className="md:w-fit w-full">
        <TabsTrigger value="month">Månad</TabsTrigger>
        <TabsTrigger value="day">Dag</TabsTrigger>
        <TabsTrigger value="year">År</TabsTrigger>
        <TabsTrigger value="free">Fritt spann</TabsTrigger>
      </TabsList>
      <TabsContent value="month">
        <Month changeDate={changeDates} />
      </TabsContent>
      <TabsContent value="day">
        <FreeDay changeDate={changeDates} />
      </TabsContent>
      <TabsContent value="year">
        <Year changeDate={changeDates} />
      </TabsContent>
      <TabsContent value="free">
        <FreeDates changeDate={changeDates} />
      </TabsContent>
    </Tabs>
  );
};

export default DateFilter;
