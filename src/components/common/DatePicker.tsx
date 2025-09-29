"use client";

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
import { useState } from "react";

const DatePicker = ({
  date,
  setDate,
  range,
  className,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
  range: FromTo;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[130px] justify-between font-normal", className)}
          >
            {date ? dateToString(date) : "Select date"}
            <Icon icon="ChevronDownIcon" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            startMonth={range.from}
            endMonth={range.to}
            reverseYears
            showOutsideDays
            onSelect={(date) => {
              date && setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
