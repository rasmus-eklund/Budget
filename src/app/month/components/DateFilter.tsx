"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "~/app/_components/Button";
import { dateToString } from "~/utils/formatData";

type Filter = {
  from: Date;
  to: Date;
};

const DateFilter = () => {
  const router = useRouter();
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

  useEffect(() => {
    router.push(
      `/month/?from=${dateToString(filter.from)}&to=${dateToString(filter.to)}`,
    );
  }, [router, filter]);

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
          <Button
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
          </Button>
          <Button
            onClick={() =>
              setFilter((p) => {
                const from = new Date(p.from);
                const to = new Date(p.to);
                from.setDate(from.getDate() - 1);
                to.setDate(to.getDate() - 1);
                return { from, to };
              })
            }
            type="button"
          >
            {"<"}
          </Button>
          <Button
            onClick={() =>
              setFilter((p) => {
                const from = new Date(p.from);
                const to = new Date(p.to);
                from.setDate(from.getDate() + 1);
                to.setDate(to.getDate() + 1);
                return { from, to };
              })
            }
            type="button"
          >
            {">"}
          </Button>
          <Button
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
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DateFilter;
