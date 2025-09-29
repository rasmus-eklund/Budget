"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "~/components/ui";
import { months } from "~/constants";
import { Tooltip, Icon } from "~/components/common";
import {
  decrementMonth,
  getYearRange,
  getMonthRange,
  incrementMonth,
  capitalize,
} from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";
import { useStore } from "~/stores/tx-store";

type Props = {
  changeDate: (dates: FromTo) => Promise<void>;
};

const Month = ({ changeDate }: Props) => {
  const { setMonth } = useStore();
  const dates = useStore((state) => state.month);
  const range = useStore((state) => state.range);
  const { year, month } = dates;
  const { from, to } = range;
  const mostRecentYear = to.getFullYear();
  const mostRecentMonth = to.getMonth() + 1;
  const years = getYearRange({ from, to });
  const submitDates = async (dates: FromTo) => {
    await changeDate(dates);
  };
  return (
    <form
      className="flex md:flex-row flex-col md:items-center gap-1"
      onSubmit={(e) => e.preventDefault()}
    >
      <Select
        value={year.toString()}
        onValueChange={async (value) => {
          const data = { year: Number(value), month };
          setMonth(data);
          await submitDates(getMonthRange(data));
        }}
      >
        <SelectTrigger className="md:w-[90px] w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.reverse().map((year) => (
            <SelectItem key={`year-${year}`} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1 w-full md:w-fit">
        <Button
          disabled={year <= from.getFullYear() && month <= from.getMonth() + 1}
          variant="outline"
          type="button"
          size="icon"
          onClick={async () => {
            const dates = decrementMonth({ year, month });
            setMonth(dates);
            await submitDates(getMonthRange(dates));
          }}
        >
          <Icon icon="ChevronLeft" className="size-4" />
        </Button>
        <Select
          value={month.toString()}
          onValueChange={async (value) => {
            const data = { year, month: Number(value) };
            setMonth(data);
            await submitDates(getMonthRange(data));
          }}
        >
          <SelectTrigger className="md:w-[130px] md:flex-none flex-1">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, n) => (
              <SelectItem key={`month-${m}`} value={(n + 1).toString()}>
                {capitalize(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={year === mostRecentYear && month === mostRecentMonth}
          variant="outline"
          size="icon"
          type="button"
          onClick={async () => {
            const dates = incrementMonth({ year, month });
            setMonth(dates);
            await submitDates(getMonthRange(dates));
          }}
        >
          <Icon icon="ChevronRight" className="size-4" />
        </Button>
      </div>
      <Tooltip title="Senaste månaden">
        <Button
          className="w-full md:w-fit"
          variant="outline"
          type="button"
          onClick={async () => {
            const data = { year: mostRecentYear, month: mostRecentMonth };
            setMonth(data);
            await submitDates(getMonthRange(data));
          }}
        >
          <p className="md:hidden">Senaste månaden</p>
          <Icon icon="CalendarCheck" />
        </Button>
      </Tooltip>
    </form>
  );
};

export default Month;
