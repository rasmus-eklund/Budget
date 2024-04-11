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
import { decrementMonth, incrementMonth } from "~/lib/utils/datePicker";
import { getYearRange } from "~/lib/utils/getYearRange";
import { type FromTo } from "~/lib/zodSchemas";

type Props = {
  changeDate: (dates: FromTo) => void;
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
  const submitDates = ({ year, month }: { year: number; month: number }) => {
    changeDate({
      from: new Date(year, month, 1),
      to: new Date(year, month + 1, 0),
    });
    return { year, month };
  };
  return (
    <form
      className="flex flex-col gap-2 p-3 md:flex-row md:justify-between"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between gap-2 md:justify-normal">
        <Select
          value={year.toString()}
          onValueChange={(value) =>
            setYearMonth(({ month }) =>
              submitDates({ year: Number(value), month }),
            )
          }
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
          onClick={() =>
            setYearMonth((dates) => submitDates(decrementMonth(dates)))
          }
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <Select
          value={month.toString()}
          onValueChange={(value) =>
            setYearMonth(({ year }) =>
              submitDates({ year, month: Number(value) }),
            )
          }
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
          onClick={() =>
            setYearMonth((dates) => submitDates(incrementMonth(dates)))
          }
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          disabled={year === mostRecentYear && month === mostRecentMonth}
          variant={"secondary"}
          onClick={() =>
            setYearMonth(
              submitDates({ year: mostRecentYear, month: mostRecentMonth }),
            )
          }
        >
          Senaste månaden
        </Button>
      </div>
    </form>
  );
};

export default Month;
