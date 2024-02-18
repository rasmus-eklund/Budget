"use client";
import { type ReactNode, useState } from "react";
import { dateToString } from "~/app/utils/formatData";

type Filter = {
  from: Date;
  to: Date;
};
type Props = {
  children: ({ filter }: { filter: Filter }) => ReactNode;
};

const DateFilter = ({ children }: Props) => {
  const firstDayOfThisMonth = new Date();
  const lastDayOfThisMonth = new Date(
    firstDayOfThisMonth.getFullYear(),
    firstDayOfThisMonth.getMonth() + 1,
    0,
  );
  firstDayOfThisMonth.setDate(1);
  const [filter, setFilter] = useState<Filter>({
    from: firstDayOfThisMonth,
    to: lastDayOfThisMonth,
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="bg-c3 flex flex-col gap-2 rounded-md p-3"
      >
        <div className="flex gap-2">
          <label htmlFor="start-date">From</label>
          <input
            id="start-date"
            type="date"
            className="px-1"
            value={dateToString(filter.from)}
            onChange={({ target: { value } }) =>
              setFilter((p) => ({ ...p, from: new Date(value) }))
            }
          />

          <label htmlFor="end-date">To</label>
          <input
            id="end-date"
            type="date"
            value={dateToString(filter.to)}
            onChange={({ target: { value } }) =>
              setFilter((p) => ({ ...p, to: new Date(value) }))
            }
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() =>
              setFilter((p) => {
                const from = new Date(p.from);
                const to = new Date(p.to);
                from.setMonth(from.getMonth() - 1);
                to.setMonth(to.getMonth() - 1);
                return { from, to };
              })
            }
            type="button"
          >
            {"<<<"}
          </button>
          <button
            onClick={() =>
              setFilter((p) => {
                const from = new Date(p.from);
                const to = new Date(p.to);
                from.setMonth(from.getMonth() + 1);
                to.setMonth(to.getMonth() + 1);
                return { from, to };
              })
            }
            type="button"
          >
            {">>>"}
          </button>
        </div>
      </form>
      {children({ filter })}
    </div>
  );
};

export default DateFilter;
