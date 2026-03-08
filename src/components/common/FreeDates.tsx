"use client";

import { useEffect, useState } from "react";
import { type FromTo } from "~/lib/zodSchemas";
import { DatePickerRange } from "~/components/common";
import { useStore } from "~/stores/tx-store";
import { Button } from "~/components/ui";

type Props = { changeDate: (dates: FromTo) => Promise<void> };

const FreeDates = ({ changeDate }: Props) => {
  const selectedRange = useStore((state) => state.selectedRange);
  const { from, to } = useStore((state) => state.range);
  const [dates, setDates] = useState<FromTo>(selectedRange);

  useEffect(() => {
    setDates(selectedRange);
  }, [selectedRange]);

  const changeDates = async (dates: FromTo) => await changeDate(dates);

  return (
    <div className="flex md:items-center gap-1 flex-col md:flex-row">
      <DatePickerRange
        className="w-full md:w-fit"
        dates={dates}
        setDate={setDates}
        range={{ from, to }}
        onChange={changeDates}
      />
      <Button
        variant="outline"
        onClick={async () => {
          const allDates = { from, to };
          setDates(allDates);
          await changeDate(allDates);
        }}
      >
        All data
      </Button>
    </div>
  );
};

export default FreeDates;
