"use client";

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "~/components/ui";
import Icon from "./Icon";
import { dateToString, cn } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";
import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

const plainDateToDate = (pDate: Temporal.PlainDate | undefined): Date | undefined => {
  if (!pDate) {
    return undefined;
  }
  return new Date(pDate.year, pDate.month - 1, pDate.day);
};

const dateToPlainDate = (date: Date): Temporal.PlainDate => {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
};

const DatePicker = ({
  date,
  setDate,
  range,
  className,
}: {
  date: Temporal.PlainDate | undefined;
  setDate: (date: Temporal.PlainDate) => void;
  range: FromTo;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const selectedDate = plainDateToDate(date);
  const startMonthDate = plainDateToDate(range.from);
  const endMonthDate = plainDateToDate(range.to);
  const defaultMonthDate = selectedDate ?? endMonthDate;

  return (
    <div className="flex flex-1 flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn("w-32.5 justify-between font-normal", className)}
            >
              {date ? dateToString(date) : "Select date"}
              <Icon icon="ChevronDown" />
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            key={(date ?? range.to).toString()}
            mode="single"
            selected={selectedDate}
            defaultMonth={defaultMonthDate}
            captionLayout="dropdown"
            startMonth={startMonthDate}
            endMonth={endMonthDate}
            reverseYears
            showOutsideDays
            onSelect={(selected) => {
              if (selected) {
                setDate(dateToPlainDate(selected));
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
