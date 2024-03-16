"use client";

import { useState } from "react";
import Button from "~/app/_components/Button";
import { months } from "~/constants/months";
import capitalize from "~/utils/capitalize";
import { decrementMonth, incrementMonth } from "~/utils/datePicker";
import { type FromTo } from "~/zodSchemas";

type Props = { changeDate: (dates: FromTo) => void };

const YearMonth = ({ changeDate }: Props) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  return (
    <form
      className="bg-c3 flex flex-col gap-2 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        changeDate({
          from: new Date(year, month, 1),
          to: new Date(year, month + 1, 0),
        });
      }}
    >
      <div className="flex items-center gap-2 rounded-md">
        <label htmlFor="year">År</label>
        <select
          id="year"
          className="px-1"
          value={year}
          onChange={({ target: { value } }) => setYear(Number(value))}
        >
          {Array(currentYear - 2013)
            .fill(0)
            .map((_, n) => (
              <option key={`year-${n}`} value={currentYear - n}>
                {currentYear - n}
              </option>
            ))}
        </select>
        <label htmlFor="month">Månad</label>
        <select
          id="month"
          value={month}
          onChange={({ target: { value } }) => setMonth(Number(value))}
        >
          {months.map((month, n) => (
            <option key={month} value={n}>
              {capitalize(month)}
            </option>
          ))}
        </select>
        <Button callToAction type="submit">
          Ok
        </Button>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={() => {
            const [newYear, newMonth] = decrementMonth(year, month);
            setYear(newYear);
            setMonth(newMonth);
          }}
        >
          {"<<<"}
        </button>
        <button
          onClick={() => {
            const [newYear, newMonth] = incrementMonth(year, month);
            setYear(newYear);
            setMonth(newMonth);
          }}
        >
          {">>>"}
        </button>
        <button
          onClick={() => {
            setYear(currentYear);
            setMonth(currentMonth);
          }}
        >
          Nuvarande månad
        </button>
      </div>
    </form>
  );
};

export default YearMonth;
