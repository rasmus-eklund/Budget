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

const DatePickerRange = ({
  dates,
  setDate,
  range,
  onChange,
}: {
  onChange: (dates: FromTo) => Promise<void>;
  dates: FromTo | undefined;
  setDate: (dates: FromTo) => void;
  range: FromTo;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="max-w-[230px] justify-between font-normal"
          >
            <Title dates={dates} />
            <ChevronDownIcon />
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
                  variant="outline"
                  onClick={async () => {
                    setOpen(false);
                    setDate({ from: range.from, to: range.to });
                    await onChange({ from: range.from, to: range.to });
                  }}
                >
                  All data
                </Button>
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
