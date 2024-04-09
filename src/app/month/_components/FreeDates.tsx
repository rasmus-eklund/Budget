"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";
import { minusOneDay, plusOneDay } from "~/lib/utils/datePicker";
import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { changeDate: (dates: FromTo) => void };

const FreeDates = ({ changeDate }: Props) => {
  const firstDayOfThisMonth = new Date();
  const lastDayOfThisMonth = new Date(
    firstDayOfThisMonth.getFullYear(),
    firstDayOfThisMonth.getMonth() + 1,
    0,
  );
  firstDayOfThisMonth.setDate(1);
  const [filter, setFilter] = useState<FromTo>({
    from: firstDayOfThisMonth,
    to: lastDayOfThisMonth,
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        changeDate(filter);
      }}
      className="flex flex-col gap-2 p-3"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex gap-2">
          <label htmlFor="start-date">Från</label>
          <input
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

export default FreeDates;
