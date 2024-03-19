"use client";

import { type ReactNode, useState } from "react";
import { minusOneDay, plusOneDay } from "~/utils/datePicker";
import { dateToString } from "~/utils/formatData";
import { type FromTo } from "~/zodSchemas";

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
      className="flex flex-col bg-red/10 p-3"
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
        <button onClick={() => setFilter(minusOneDay)}>{"<"}</button>
        <button onClick={() => setFilter(plusOneDay)}>{">"}</button>
      </div>
    </form>
  );
};

export default FreeDates;
