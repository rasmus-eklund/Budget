"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/components/common/Icon";
import {
  decrementDay,
  getDayRange,
  incrementDay,
} from "~/lib/utils/dateCalculations";
import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";
import DatePicker from "../DatePicker";
import Tooltip from "../Tooltip";

type Props = { changeDate: (dates: FromTo) => Promise<void>; fromTo: FromTo };

const FreeDay = ({ changeDate, fromTo: { from, to } }: Props) => {
  const [day, setDay] = useState(to);
  const onChange = async (dates: FromTo) => {
    setDay(dates.from);
    await changeDate(dates);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-1"
    >
      <Button
        type="button"
        disabled={day <= from}
        variant="outline"
        size="icon"
        onClick={async () => await onChange(decrementDay(day))}
      >
        <Icon icon="ChevronLeft" className="size-4" />
      </Button>
      <DatePicker
        range={{ from, to }}
        date={day}
        setDate={async (date) => {
          setDay(date);
          await onChange(getDayRange(dateToString(date)));
        }}
      />
      <Button
        type="button"
        disabled={day >= to}
        variant="outline"
        size="icon"
        onClick={async () => await onChange(incrementDay(day))}
      >
        <Icon icon="ChevronRight" className="size-4" />
      </Button>
      <Tooltip title="Senaste dagen">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={async () => await onChange(getDayRange(dateToString(to)))}
        >
          <Icon icon="CalendarCheck" />
        </Button>
      </Tooltip>
    </form>
  );
};

export default FreeDay;
