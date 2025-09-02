"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Icon from "~/components/common/Icon";
import { getYearRange } from "~/lib/utils/dateCalculations";
import { type FromTo } from "~/lib/zodSchemas";

type Props = {
  changeDate: (dates: FromTo) => Promise<void>;
  fromTo: FromTo;
};

const Year = ({ changeDate, fromTo: { from, to } }: Props) => {
  const mostRecentYear = to.getFullYear();
  const [year, setYear] = useState(mostRecentYear);
  const submitYear = async (year: number) => {
    await changeDate({
      from: new Date(Date.UTC(year, 0, 1)),
      to: new Date(Date.UTC(year + 1, 0, 0)),
    });
  };
  const years = getYearRange({ from, to });
  return (
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center gap-1">
        <Button
          disabled={from.getFullYear() === year}
          variant="outline"
          type="button"
          size="icon"
          onClick={async () => {
            const newYear = year - 1;
            setYear(newYear);
            await submitYear(newYear);
          }}
        >
          <Icon icon="ChevronLeft" />
        </Button>
        <Select
          value={year.toString()}
          onValueChange={async (year) => {
            const y = Number(year);
            setYear(y);
            await submitYear(y);
          }}
        >
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {years.reverse().map((year) => (
              <SelectItem key={`year-${year}`} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={mostRecentYear === year}
          variant="outline"
          size="icon"
          type="button"
          onClick={async () => {
            const newYear = year + 1;
            setYear(newYear);
            await submitYear(newYear);
          }}
        >
          <Icon icon="ChevronRight" className="size-4" />
        </Button>
      </div>
      <Button
        variant={"secondary"}
        type="button"
        onClick={async () => {
          setYear(mostRecentYear);
          await submitYear(mostRecentYear);
        }}
      >
        Senaste året
      </Button>
    </form>
  );
};

export default Year;
