"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";
import { minusOneDay, plusOneDay } from "~/lib/utils/datePicker";
import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { changeDate: (dates: FromTo) => void; fromTo: FromTo };

const FreeDay = ({ changeDate, fromTo: { from, to } }: Props) => {
  const [filter, setFilter] = useState<FromTo>({ from: to, to });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        changeDate(filter);
      }}
      className="flex flex-col gap-2 p-3 md:flex-row md:justify-between"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          min={dateToString(from)}
          max={dateToString(to)}
          id="start-date"
          type="date"
          className="px-1"
          value={dateToString(filter.from)}
          onChange={({ target: { value } }) =>
            setFilter((p) => ({ ...p, from: new Date(value) }))
          }
        />

        <Button variant={"default"} type="submit">
          Ok
        </Button>
      </div>
      <div className="flex items-center justify-between gap-4 md:justify-normal">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFilter(minusOneDay)}
        >
          <Icon icon="caretLeft" className="size-4" />
        </Button>
        <p>Dag</p>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFilter(plusOneDay)}
        >
          <Icon icon="caretRight" className="size-4" />
        </Button>
      </div>
    </form>
  );
};

export default FreeDay;
