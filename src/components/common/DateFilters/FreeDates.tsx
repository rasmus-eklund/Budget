"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { changeDate: (dates: FromTo) => Promise<void>; fromTo: FromTo };

const FreeDates = ({ changeDate, fromTo: { from, to } }: Props) => {
  const [filter, setFilter] = useState<FromTo>({ from, to });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await changeDate(filter);
      }}
      className="flex flex-col gap-2 p-3 md:flex-row md:justify-between"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex gap-2">
          <label htmlFor="start-date">Från</label>
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
        </div>
        <div className="flex gap-2">
          <label htmlFor="end-date">Till</label>
          <input
            min={dateToString(from)}
            max={dateToString(to)}
            id="end-date"
            type="date"
            value={dateToString(filter.to)}
            onChange={({ target: { value } }) =>
              setFilter((p) => ({ ...p, to: new Date(value) }))
            }
          />
        </div>
        <Button variant={"default"} type="submit">
          Ok
        </Button>
      </div>
    </form>
  );
};

export default FreeDates;
