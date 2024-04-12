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
import { months } from "~/lib/constants/months";
import Icon from "~/lib/icons/Icon";
import capitalize from "~/lib/utils/capitalize";
import { decrementMonth, incrementMonth } from "~/lib/utils/dateCalculations";
import { getYearRange } from "~/lib/utils/dateCalculations";
import { type FromTo } from "~/lib/zodSchemas";

type YearMonth = { year: number; month: number };

type Props = {
  changeDate: (dates: FromTo) => Promise<void>;
  fromTo: FromTo;
};

const Month = ({ changeDate, fromTo: { from, to } }: Props) => {
  const mostRecentYear = to.getFullYear();
  const mostRecentMonth = to.getMonth();
  const [{ year, month }, setYearMonth] = useState({
    year: mostRecentYear,
    month: mostRecentMonth,
  });
  const years = getYearRange({ from, to });
  const submitDates = async ({ year, month }: YearMonth) => {
    await changeDate({
      from: new Date(year, month, 1),
      to: new Date(year, month + 1, 0),
    });
  };
  return (
    <form
      className="flex flex-col gap-2 p-3 md:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between gap-2 md:justify-normal">
        <Select
          value={year.toString()}
          onValueChange={async (value) => {
            setYearMonth({ year: Number(value), month });
            await submitDates({ year: Number(value), month });
          }}
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
          disabled={year <= from.getFullYear() && month <= from.getMonth()}
          variant="outline"
          size="icon"
          onClick={async () => {
            const dates = decrementMonth({ year, month });
            setYearMonth(dates);
            await submitDates(dates);
          }}
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <Select
          value={month.toString()}
          onValueChange={async (value) => {
            setYearMonth({ year, month: Number(value) });
            await submitDates({ year, month: Number(value) });
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, n) => (
              <SelectItem key={`month-${m}`} value={n.toString()}>
                {capitalize(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={year === mostRecentYear && month === mostRecentMonth}
          variant="outline"
          size="icon"
          onClick={async () => {
            const dates = incrementMonth({ month, year });
            setYearMonth(dates);
            await submitDates(dates);
          }}
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          variant={"secondary"}
          onClick={async () => {
            setYearMonth({ year: mostRecentYear, month: mostRecentMonth });
            await submitDates({ year: mostRecentYear, month: mostRecentMonth });
          }}
        >
          Senaste månaden
        </Button>
      </div>
    </form>
  );
};

export default Month;
