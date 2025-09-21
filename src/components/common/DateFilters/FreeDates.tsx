"use client";

import { type FromTo } from "~/lib/zodSchemas";
import DatePickerRange from "../DatePickerRange";
import { useStore } from "~/stores/tx-store";
import { Button } from "~/components/ui/button";

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
    <div className="flex items-center gap-2">
      <DatePickerRange
        dates={dates}
        setDate={setDates}
        range={{ from, to }}
        onChange={changeDates}
      />
      <Button
        variant="outline"
        onClick={async () => {
          setDates({ from, to });
          await changeDate({ from, to });
        }}
      >
        All data
      </Button>
    </div>
  );
};

export default FreeDates;
