"use client";
import Tabs from "~/components/common/Tabs";
import FreeDates from "./FreeDates";
import YearMonth from "./YearMonth";
import { Button } from "~/components/ui/button";
import type { FromTo } from "~/lib/zodSchemas";

type Props = { changeDates: (dates: FromTo) => void };
const DateFilter = ({ changeDates }: Props) => {
  return (
    <Tabs
      tabs={[
        {
          name: "År månad",
          tab: (
            <YearMonth changeDate={changeDates}>
              <Button variant={"secondary"} type="submit">
                Ok
              </Button>
            </YearMonth>
          ),
        },
        {
          name: "Fritt spann",
          tab: (
            <FreeDates changeDate={changeDates}>
              <Button variant={"secondary"} type="submit">
                Ok
              </Button>
            </FreeDates>
          ),
        },
      ]}
    />
  );
};

export default DateFilter;
