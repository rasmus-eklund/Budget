"use client";

import { Button } from "~/components/ui";
import { SimpleSelect } from "~/components/common";
import { months } from "~/constants";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import { decrementMonth, getYearRange, getMonthRange, incrementMonth } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";
import { useStore } from "~/stores/tx-store";

type Props = {
  changeDate: (dates: FromTo) => void;
};

const Month = ({ changeDate }: Props) => {
  const draftRange = useStore((state) => state.draftRange);
  const range = useStore((state) => state.range);
  const year = draftRange.from.getFullYear();
  const month = draftRange.from.getMonth() + 1;
  const { from, to } = range;
  const mostRecentYear = to.getFullYear();
  const mostRecentMonth = to.getMonth() + 1;
  const years = getYearRange({ from, to });
  const submitDates = async (dates: FromTo) => changeDate(dates);
  return (
    <form
      className="flex flex-col gap-1 md:flex-row md:items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <SimpleSelect
        value={year.toString()}
        onValueChange={async (value) => {
          if (!value) {
            return;
          }
          const data = { year: Number(value), month };
          await submitDates(getMonthRange(data));
        }}
        options={years.reverse().map((y) => ({
          value: y.toString(),
          label: y,
        }))}
        testId="month-year-select"
      />
      <div className="flex w-full items-center gap-1 md:w-fit">
        <Button
          data-testid="month-prev"
          disabled={year <= from.getFullYear() && month <= from.getMonth() + 1}
          variant="outline"
          type="button"
          size="icon"
          onClick={async () => {
            const dates = decrementMonth({ year, month });
            await submitDates(getMonthRange(dates));
          }}
        >
          <Icon icon="ChevronLeft" className="size-4" />
        </Button>
        <SimpleSelect
          value={month.toString()}
          onValueChange={async (value) => {
            if (!value) {
              return;
            }
            const data = { year, month: Number(value) };
            await submitDates(getMonthRange(data));
          }}
          options={months.map((m, n) => ({
            value: (n + 1).toString(),
            label: m,
            className: "first-letter:capitalize",
          }))}
          testId="month-month-select"
        />
        <Button
          data-testid="month-next"
          disabled={year === mostRecentYear && month === mostRecentMonth}
          variant="outline"
          size="icon"
          type="button"
          onClick={async () => {
            const dates = incrementMonth({ year, month });
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
