"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { dateToString } from "~/lib/utils/formatData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type FromTo } from "~/lib/zodSchemas";

const DatePicker = ({
  date,
  setDate,
  range,
}: {
  date: Date | undefined;
  setDate: (date: Date) => void;
  range: FromTo;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[130px] justify-between font-normal"
          >
            {date ? dateToString(date) : "Select date"}
            <ChevronDownIcon />
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
