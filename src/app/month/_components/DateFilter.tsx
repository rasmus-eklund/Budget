"use client";
import FreeDates from "./FreeDates";
import YearMonth from "./YearMonth";
import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui/tabs";

type Props = { changeDates: (dates: FromTo) => void; years: number[] };
const DateFilter = ({ changeDates, years }: Props) => {
  return (
    <Tabs defaultValue="month">
      <TabsList>
        <TabsTrigger value="month">Månad</TabsTrigger>
        <TabsTrigger value="free">Fritt spann</TabsTrigger>
      </TabsList>
      <TabsContent value="month">
        <YearMonth changeDate={changeDates} years={years} />
      </TabsContent>
      <TabsContent value="free">
        <FreeDates changeDate={changeDates} />
      </TabsContent>
    </Tabs>
  );
};

export default DateFilter;
