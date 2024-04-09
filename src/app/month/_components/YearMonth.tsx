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
import { type FromTo } from "~/lib/zodSchemas";

type Props = { changeDate: (dates: FromTo) => void; years: number[] };

const YearMonth = ({ changeDate, years }: Props) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  return (
    <form
      className="flex flex-col gap-2 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        changeDate({
          from: new Date(year, month, 1),
          to: new Date(year, month + 1, 0),
        });
      }}
    >
      <div className="flex items-center justify-between gap-2 rounded-md md:justify-normal">
        <Select
          value={year.toString()}
          onValueChange={(value) => setYear(Number(value))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="År" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={`year-${year}`} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={month.toString()}
          onValueChange={(value) => setMonth(Number(value))}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Månad" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, n) => (
              <SelectItem key={`month-${m}`} value={n.toString()}>
                {capitalize(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant={"default"} type="submit">
          Ok
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2 md:justify-normal">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const [newYear, newMonth] = decrementMonth(year, month);
            setYear(newYear);
            setMonth(newMonth);
          }}
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <p>Månad</p>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const [newYear, newMonth] = incrementMonth(year, month);
            setYear(newYear);
            setMonth(newMonth);
          }}
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            setYear(currentYear);
            setMonth(currentMonth);
          }}
        >
          Nuvarande månad
        </Button>
      </div>
    </form>
  );
};

export default YearMonth;
