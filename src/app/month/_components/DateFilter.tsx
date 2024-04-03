"use client";
import FreeDates from "./FreeDates";
import YearMonth from "./YearMonth";
import { Button } from "~/components/ui/button";
import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui/tabs";

type Props = { changeDates: (dates: FromTo) => void };
const DateFilter = ({ changeDates }: Props) => {
  return (
    <Tabs defaultValue="month">
      <TabsList>
        <TabsTrigger value="month">Månad</TabsTrigger>
        <TabsTrigger value="free">Fritt spann</TabsTrigger>
      </TabsList>
      <TabsContent value="month">
        <YearMonth changeDate={changeDates}>
          <Button variant={"secondary"} type="submit">
            Ok
          </Button>
        </YearMonth>
      </TabsContent>
      <TabsContent value="free">
        <FreeDates changeDate={changeDates}>
          <Button variant={"secondary"} type="submit">
            Ok
          </Button>
        </FreeDates>
      </TabsContent>
    </Tabs>
  );
};

export default DateFilter;
