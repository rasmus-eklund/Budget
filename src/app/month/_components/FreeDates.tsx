"use client";

import { useState } from "react";
import Button from "~/app/_components/Button";
import { dateToString } from "~/utils/formatData";
import { type FromTo } from "~/zodSchemas";

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
      className="bg-c3 flex items-center gap-2 rounded-md p-3"
    >
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
      <Button callToAction type="submit">
        Ok
      </Button>
    </form>
  );
};

export default FreeDates;
