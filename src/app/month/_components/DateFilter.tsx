"use client";
import { useRouter } from "next/navigation";
import Tabs from "~/app/_components/Tabs";
import { dateToString } from "~/utils/formatData";
import FreeDates from "./FreeDates";
import YearMonth from "./YearMonth";
import { Button } from "~/components/ui/button";

type FromTo = {
  from: Date;
  to: Date;
};

const DateFilter = () => {
  const router = useRouter();

  const changeDate = ({ from, to }: FromTo) => {
    router.push(`/month/?from=${dateToString(from)}&to=${dateToString(to)}`);
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
