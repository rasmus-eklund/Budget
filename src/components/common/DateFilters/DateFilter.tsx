"use client";

import FreeDates from "./FreeDates";
import Month from "./Month";
import type { FromTo } from "~/lib/zodSchemas";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "~/components/ui/tabs";
import FreeDay from "./Day";
import Year from "./Year";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";

type Props = { changeDates: (dates: FromTo) => Promise<void>; range: FromTo };
const DateFilter = ({ changeDates, range }: Props) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return <TheTabs changeDates={changeDates} range={range} />;
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Icon icon="calendar" className="size-5 fill-slate-500" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Välj datum</DrawerTitle>
        </DrawerHeader>
        <TheTabs changeDates={changeDates} range={range} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Stäng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const TheTabs = ({ changeDates, range }: Props) => {
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
