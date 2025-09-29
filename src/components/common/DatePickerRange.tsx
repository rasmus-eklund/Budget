"use client";

import * as React from "react";

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui";
import { Icon } from "~/components/common";
import { dateToString, cn } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";

const DatePickerRange = ({
  dates,
  setDate,
  range,
  onChange,
  className,
}: {
  onChange: (dates: FromTo) => Promise<void>;
  dates: FromTo | undefined;
  setDate: (dates: FromTo) => void;
  range: FromTo;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3 flex-1 md:flex-none">
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-between font-normal", className)}
          >
            <Title dates={dates} />
            <Icon icon="ChevronDownIcon" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={dates}
            captionLayout="dropdown"
            startMonth={range.from}
            endMonth={range.to}
            reverseYears
            showOutsideDays
            onSelect={(dates) => {
              dates?.from &&
                dates?.to &&
                setDate({ from: dates.from, to: dates.to });
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
