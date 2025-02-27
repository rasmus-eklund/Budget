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
import {
  decrementMonth,
  getMonthRange,
  incrementMonth,
} from "~/lib/utils/dateCalculations";
import { getYearRange } from "~/lib/utils/dateCalculations";
import { type FromTo } from "~/lib/zodSchemas";

type Props = {
  changeDate: (dates: FromTo) => Promise<void>;
  fromTo: FromTo;
};

const Month = ({ changeDate, fromTo: { from, to } }: Props) => {
  const mostRecentYear = to.getFullYear();
  const mostRecentMonth = to.getMonth() + 1;
  const [{ year, month }, setYearMonth] = useState({
    year: mostRecentYear,
    month: mostRecentMonth,
  });
  const years = getYearRange({ from, to });
  const submitDates = async (dates: FromTo) => {
    await changeDate(dates);
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
            const data = { year: Number(value), month };
            setYearMonth(data);
            await submitDates(getMonthRange(data));
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
            await submitDates(getMonthRange(dates));
          }}
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <Select
          value={month.toString()}
          onValueChange={async (value) => {
            const data = { year, month: Number(value) };
            setYearMonth(data);
            await submitDates(getMonthRange(data));
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, n) => (
              <SelectItem key={`month-${m}`} value={(n + 1).toString()}>
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
            const dates = incrementMonth({ year, month });
            setYearMonth(dates);
            await submitDates(getMonthRange(dates));
          }}
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          variant={"secondary"}
          onClick={async () => {
            const data = { year: mostRecentYear, month: mostRecentMonth };
            setYearMonth(data);
            await submitDates(getMonthRange(data));
          }}
        >
          Senaste månaden
        </Button>
      </div>
    </form>
  );
};

export default Month;
