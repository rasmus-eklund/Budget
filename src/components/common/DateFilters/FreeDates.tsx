"use client";

import { type FromTo } from "~/lib/zodSchemas";
import DatePickerRange from "../DatePickerRange";
import { useStore } from "~/stores/tx-store";

type Props = { changeDate: (dates: FromTo) => Promise<void> };

const FreeDates = ({ changeDate }: Props) => {
  const { setDates, setDrawerOpen } = useStore();
  const dates = useStore((state) => state.dates);
  const { from, to } = useStore((state) => state.range);
  const changeDates = async (dates: FromTo) => {
    setDrawerOpen(false);
    await changeDate(dates);
  };
  return (
    <DatePickerRange
      dates={dates}
      setDate={setDates}
      range={{ from, to }}
      onChange={changeDates}
    />
  );
};

export default FreeDates;
