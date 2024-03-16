"use client";
import { useRouter } from "next/navigation";
import Tabs from "~/app/_components/Tabs";
import { dateToString } from "~/utils/formatData";
import FreeDates from "./FreeDates";
import YearMonth from "./YearMonth";

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
    <div>
      <Tabs
        tabs={[
          { name: "År månad", tab: <YearMonth changeDate={changeDate} /> },
          { name: "Fritt spann", tab: <FreeDates changeDate={changeDate} /> },
        ]}
      />
    </div>
  );
};

export default DateFilter;
