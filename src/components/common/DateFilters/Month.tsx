"use client";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { months } from "~/lib/constants/months";
import Icon from "~/components/common/Icon";
import capitalize from "~/lib/utils/capitalize";
import {
  decrementMonth,
  getMonthRange,
  incrementMonth,
} from "~/lib/utils/dateCalculations";
import { getYearRange } from "~/lib/utils/dateCalculations";
import { type FromTo } from "~/lib/zodSchemas";
import Tooltip from "../Tooltip";
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
      className="flex items-center gap-1"
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
        <SelectTrigger className="w-[90px]">
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
      <Button
        disabled={year <= from.getFullYear() && month <= from.getMonth()}
        variant="outline"
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
        <SelectTrigger className="w-[130px]">
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
        onClick={async () => {
          const dates = incrementMonth({ year, month });
          setMonth(dates);
          await submitDates(getMonthRange(dates));
        }}
      >
        <Icon icon="ChevronRight" className="size-4" />
      </Button>
      <Tooltip title="Senaste månaden">
        <Button
          variant="outline"
          size="icon"
          onClick={async () => {
            const data = { year: mostRecentYear, month: mostRecentMonth };
            setMonth(data);
            await submitDates(getMonthRange(data));
          }}
        >
          <Icon icon="CalendarCheck" />
        </Button>
      </Tooltip>
    </form>
  );
};

export default Month;
