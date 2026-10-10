"use client";

import * as React from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "~/components/ui";
import Icon from "./Icon";
import { dateToString, cn } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";

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

const DatePickerRange = ({
  dates,
  setDate,
  range,
  onChange,
  className,
}: {
  onChange: (dates: FromTo) => void | Promise<void>;
  dates: FromTo | undefined;
  setDate: (dates: FromTo) => void;
  range: FromTo;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedRange = dates
    ? { from: plainDateToDate(dates.from), to: plainDateToDate(dates.to) }
    : undefined;
  const startMonthDate = plainDateToDate(range.from);
  const endMonthDate = plainDateToDate(range.to);
  const defaultMonthDate = selectedRange?.from ?? endMonthDate;

  return (
    <div className="flex flex-1 flex-col gap-3 md:flex-none">
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" className={cn("justify-between font-normal", className)}>
              <Title dates={dates} />
              <Icon icon="ChevronDown" />
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            key={(dates?.from ?? range.to).toString()}
            mode="range"
            selected={selectedRange}
            defaultMonth={defaultMonthDate}
            captionLayout="dropdown"
            startMonth={startMonthDate}
            endMonth={endMonthDate}
            reverseYears
            showOutsideDays
            onSelect={(rangeSelection) => {
              if (rangeSelection?.from && rangeSelection.to) {
                setDate({
                  from: dateToPlainDate(rangeSelection.from),
                  to: dateToPlainDate(rangeSelection.to),
                });
              }
            }}
            footer={
              <div className="flex justify-end gap-2">
                <Button
                  disabled={!dates}
                  onClick={async () => {
                    if (dates) {
                      setOpen(false);
                      await onChange(dates);
                    }
                  }}
                >
                  Ok
                </Button>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Title = ({ dates }: { dates: FromTo | undefined }) => {
  if (!dates) {
    return <p>Välj datum</p>;
  }
  return (
    <div className="flex items-center gap-2">
      <p>{dateToString(dates.from)}</p>
      <p>-</p>
      <p>{dateToString(dates.to)}</p>
    </div>
  );
};

export default DatePickerRange;
