"use client";

import FreeDates from "./FreeDates";
import Month from "./Month";
import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui/tabs";
import FreeDay from "./Day";
import Year from "./Year";
import { useMediaQuery } from "~/hooks/use-media-query";
import Drawer from "../Drawer";
import { useStore } from "~/stores/tx-store";
import type { DateTab } from "~/types";

type Props = { changeDates: (dates: FromTo) => Promise<void> };
const DateFilter = ({ changeDates }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });
  if (isDesktop) return <TabsDesktop changeDates={changeDates} />;
  return (
    <div className="flex items-center px-2 pt-2 absolute right-1 top-1">
      <Drawer icon="CalendarCog" title="Datumfilter">
        <TabsDesktop changeDates={changeDates} />
      </Drawer>
    </div>
  );
};

const TabsDesktop = ({ changeDates }: Props) => {
  const { setDateTab } = useStore();
  const dateTab = useStore((state) => state.dateTab);
  const range = useStore((state) => state.range);
  return (
    <Tabs
      value={dateTab}
      onValueChange={(value) => setDateTab(value as DateTab)}
      className="pt-2"
    >
      <TabsList>
        <TabsTrigger value="month">Månad</TabsTrigger>
        <TabsTrigger value="day">Dag</TabsTrigger>
        <TabsTrigger value="year">År</TabsTrigger>
        <TabsTrigger value="free">Fritt spann</TabsTrigger>
      </TabsList>
      <TabsContent value="month">
        <Month changeDate={changeDates} fromTo={range} />
      </TabsContent>
      <TabsContent value="day">
        <FreeDay changeDate={changeDates} fromTo={range} />
      </TabsContent>
      <TabsContent value="year">
        <Year changeDate={changeDates} fromTo={range} />
      </TabsContent>
      <TabsContent value="free">
        <FreeDates changeDate={changeDates} fromTo={range} />
      </TabsContent>
    </Tabs>
  );
};

export default DateFilter;
