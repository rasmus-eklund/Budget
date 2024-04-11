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
import Icon from "~/lib/icons/Icon";
import { getYearRange } from "~/lib/utils/getYearRange";
import { type FromTo } from "~/lib/zodSchemas";

type Props = {
  changeDate: (dates: FromTo) => void;
  fromTo: FromTo;
};

const Year = ({ changeDate, fromTo: { from, to } }: Props) => {
  const mostRecentYear = to.getFullYear();
  const [year, setYear] = useState(mostRecentYear);
  const submitYear = (year: number) => {
    changeDate({
      from: new Date(year, 0, 1),
      to: new Date(year + 1, 0, 0),
    });
    return year;
  };
  const years = getYearRange({ from, to });
  return (
    <form
      className="flex flex-col gap-2 p-3 md:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between gap-2 md:justify-normal">
        <Button
          disabled={from.getFullYear() === year}
          variant="outline"
          type="button"
          size="icon"
          onClick={() => setYear((p) => submitYear(p - 1))}
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <Select
          value={year.toString()}
          onValueChange={(year) => setYear(() => submitYear(Number(year)))}
        >
          <SelectTrigger className="w-[160px]">
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
          onClick={() => setYear((p) => submitYear(p + 1))}
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
      </div>
      <Button
        disabled={mostRecentYear === year}
        variant={"secondary"}
        type="button"
        onClick={() => setYear(() => submitYear(mostRecentYear))}
      >
        Senaste året
      </Button>
    </form>
  );
};

export default Year;
