"use client";
import { useRouter } from "next/navigation";
import Tabs from "~/components/common/Tabs";
import { dateToString } from "~/lib/utils/formatData";
import FreeDates from "./FreeDates";
import YearMonth from "./YearMonth";
import { Button } from "~/components/ui/button";
import type { FromTo } from "~/lib/zodSchemas";

type Props = { path: string };
const DateFilter = ({ path }: Props) => {
  const router = useRouter();

  const changeDate = ({ from, to }: FromTo) => {
    router.push(`/${path}/?from=${dateToString(from)}&to=${dateToString(to)}`);
  };

  return (
    <Tabs
      tabs={[
        {
          name: "År månad",
          tab: (
            <YearMonth changeDate={changeDate}>
              <Button variant={"secondary"} type="submit">
                Ok
              </Button>
            </YearMonth>
          ),
        },
        {
          name: "Fritt spann",
          tab: (
            <FreeDates changeDate={changeDate}>
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
