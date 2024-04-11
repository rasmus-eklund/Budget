"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";
import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { changeDate: (dates: FromTo) => Promise<void>; fromTo: FromTo };

const FreeDay = ({ changeDate, fromTo: { from, to } }: Props) => {
  const [day, setDay] = useState(to);
  const onChange = async (date: Date) => {
    await changeDate({ from: date, to: date });
  };
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center justify-between gap-2 p-3 md:justify-normal"
    >
      <Button
        disabled={day <= from}
        variant="outline"
        size="icon"
        onClick={async () => {
          const date = new Date(day.setDate(day.getDate() - 1));
          setDay(date);
          await onChange(date);
        }}
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
          const date = new Date(value);
          setDay(date);
          await onChange(date);
        }}
      />
      <Button
        disabled={day >= to}
        variant="outline"
        size="icon"
        onClick={async () => {
          const date = new Date(day.setDate(day.getDate() + 1));
          setDay(date);
          await onChange(date);
        }}
      >
        <Icon icon="caretRight" className="size-4" />
      </Button>
      <Button
        variant="secondary"
        onClick={async () => {
          setDay(to);
          await onChange(to);
        }}
      >
        Senaste dagen
      </Button>
    </form>
  );
};

export default FreeDay;
