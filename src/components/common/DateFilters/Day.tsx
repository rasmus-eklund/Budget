"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";
import { decrementDay, incrementDay } from "~/lib/utils/dateCalculations";
import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { changeDate: (dates: FromTo) => Promise<void>; fromTo: FromTo };

const FreeDay = ({ changeDate, fromTo: { from, to } }: Props) => {
  const [day, setDay] = useState(to);
  const onChange = async (date: Date) => {
    setDay(date);
    await changeDate({ from: date, to: date });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2 p-3 md:flex-row"
    >
      <div className="flex items-center justify-between gap-2 md:justify-normal">
        <Button
          type="button"
          disabled={day <= from}
          variant="outline"
          size="icon"
          onClick={async () => await onChange(decrementDay(day))}
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <input
          min={dateToString(from)}
          max={dateToString(to)}
          type="date"
          className="px-1"
          value={dateToString(day)}
          onChange={async ({ target: { value } }) => {
            const [year, month, day] = value.split("-").map(Number);
            await onChange(new Date(Date.UTC(year!, month! - 1, day)));
          }}
        />
        <Button
          type="button"
          disabled={day >= to}
          variant="outline"
          size="icon"
          onClick={async () => await onChange(incrementDay(day))}
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={async () => await onChange(to)}
      >
        Senaste dagen
      </Button>
    </form>
  );
};

export default FreeDay;
