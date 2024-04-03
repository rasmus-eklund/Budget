"use client";

import { type ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";
import { minusOneDay, plusOneDay } from "~/lib/utils/datePicker";
import { dateToString } from "~/lib/utils/formatData";
import { type FromTo } from "~/lib/zodSchemas";

type Props = { children: ReactNode; changeDate: (dates: FromTo) => void };

const FreeDates = ({ children, changeDate }: Props) => {
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
      className="flex flex-col p-3"
    >
      <div className="flex items-center gap-2">
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

        <label htmlFor="end-date">Till</label>
        <input
          id="end-date"
          type="date"
          value={dateToString(filter.to)}
          onChange={({ target: { value } }) =>
            setFilter((p) => ({ ...p, to: new Date(value) }))
          }
        />
        {children}
      </div>
      <div className="flex items-center gap-4">
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
