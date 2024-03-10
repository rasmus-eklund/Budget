"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "~/app/_components/Button";
import { dateToString } from "~/utils/formatData";

type Filter = {
  from: Date;
  to: Date;
};

const DateFilter = () => {
  const router = useRouter();
  // const month = [
  //   "Januari",
  //   "Februari",
  //   "Mars",
  //   "April",
  //   "Maj",
  //   "Juni",
  //   "Juli",
  //   "Augusti",
  //   "September",
  //   "Oktober",
  //   "November",
  //   "December",
  // ];
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

  const minusOneMonth = (p: Filter) => {
    const from = new Date(p.from);
    const to = new Date(p.to);
    from.setMonth(from.getMonth() - 1);
    to.setMonth(to.getMonth() - 1);
    return { from, to };
  };
  const minusOneDay = (p: Filter) => {
    const from = new Date(p.from);
    const to = new Date(p.to);
    from.setDate(from.getDate() - 1);
    to.setDate(to.getDate() - 1);
    return { from, to };
  };
  const plusOneDay = (p: Filter) => {
    const from = new Date(p.from);
    const to = new Date(p.to);
    from.setDate(from.getDate() + 1);
    to.setDate(to.getDate() + 1);
    return { from, to };
  };
  const plusOneMonth = (p: Filter) => {
    const from = new Date(p.from);
    const to = new Date(p.to);
    from.setMonth(from.getMonth() + 1);
    to.setMonth(to.getMonth() + 1);
    return { from, to };
  };
  const onSubmit = ({ from, to }: Filter) => {
    console.log({ from, to });
    router.push(`/month/?from=${dateToString(from)}&to=${dateToString(to)}`);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(filter);
        }}
        className="bg-c3 flex flex-col gap-2 rounded-md p-3"
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
          <Button type="submit">Ok</Button>
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setFilter(minusOneMonth)} type="button">
            {"- månad"}
          </Button>
          <Button onClick={() => setFilter(minusOneDay)} type="button">
            {"- dag"}
          </Button>
          <Button onClick={() => setFilter(plusOneDay)} type="button">
            {"+ dag"}
          </Button>
          <Button onClick={() => setFilter(plusOneMonth)} type="button">
            {"+ månad"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DateFilter;
