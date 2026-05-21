"use client";

import { useEffect, useState } from "react";
import { type FromTo } from "~/lib/zodSchemas";
import { DatePickerRange } from "~/components/common";
import { useStore } from "~/stores/tx-store";
import { Button } from "~/components/ui";

type Props = { changeDate: (dates: FromTo) => void };

const FreeDates = ({ changeDate }: Props) => {
  const draftRange = useStore((state) => state.draftRange);
  const { from, to } = useStore((state) => state.range);
  const [dates, setDates] = useState<FromTo>(draftRange);

  useEffect(() => {
    setDates(draftRange);
  }, [draftRange]);

  const changeDates = async (dates: FromTo) => await changeDate(dates);

  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-center">
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
