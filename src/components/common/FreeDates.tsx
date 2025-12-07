"use client";

import { type FromTo } from "~/lib/zodSchemas";
import { DatePickerRange } from "~/components/common";
import { useStore } from "~/stores/tx-store";
import { Button } from "~/components/ui";

type Props = { changeDate: (dates: FromTo) => Promise<void> };

const FreeDates = ({ changeDate }: Props) => {
  const setDates = useStore((state) => state.setDates);
  const dates = useStore((state) => state.dates);
  const { from, to } = useStore((state) => state.range);
  const changeDates = async (dates: FromTo) => {
    await changeDate(dates);
  };
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
