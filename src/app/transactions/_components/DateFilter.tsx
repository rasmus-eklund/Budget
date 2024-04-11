"use client";
import FreeDates from "./FreeDates";
import Month from "./Month";
import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui/tabs";
import FreeDay from "./Day";
import Year from "./Year";

type Props = { changeDates: (dates: FromTo) => void; range: FromTo };
const DateFilter = ({ changeDates, range }: Props) => {
  return (
    <Tabs defaultValue="month">
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
