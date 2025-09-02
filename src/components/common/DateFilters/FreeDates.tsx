"use client";

import { useState } from "react";
import { type FromTo } from "~/lib/zodSchemas";
import DatePickerRange from "../DatePickerRange";

type Props = { changeDate: (dates: FromTo) => Promise<void>; fromTo: FromTo };

const FreeDates = ({ changeDate, fromTo: { from, to } }: Props) => {
  const [dates, setDates] = useState<FromTo>({ from, to });
  return (
    <DatePickerRange
      dates={dates}
      setDate={setDates}
      range={{ from, to }}
      onChange={changeDate}
    />
  );
};

export default FreeDates;
