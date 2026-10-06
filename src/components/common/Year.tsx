"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "~/components/ui";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import { getYearRange } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";
import { useStore } from "~/stores/tx-store";

import { Temporal } from "@js-temporal/polyfill";

type Props = {
  changeDate: (dates: FromTo) => void;
};

const Year = ({ changeDate }: Props) => {
  const { from, to } = useStore((state) => state.range);
  const draftRange = useStore((state) => state.draftRange);
  const year = draftRange.from.year;
  const mostRecentYear = to.year;
  const submitYear = async (year: number) =>
    changeDate({
      from: Temporal.PlainDate.from({ year, month: 1, day: 1 }),
      to: Temporal.PlainDate.from({ year, month: 12, day: 31 }),
    });

  const years = getYearRange({ from, to });
  return (
    <form
      className="flex flex-col gap-1 md:flex-row md:items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-1">
        <Button
          disabled={from.year === year}
          variant="outline"
          type="button"
          size="icon"
          onClick={async () => {
            const newYear = year - 1;
            await submitYear(newYear);
          }}
        >
          <Icon icon="ChevronLeft" />
        </Button>
        <Select
          value={year.toString()}
          onValueChange={async (year) => {
            const y = Number(year);
            await submitYear(y);
          }}
        >
          <SelectTrigger data-testid="year-select" className="w-full md:w-22.5">
            <SelectValue placeholder="" />
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
          disabled={mostRecentYear === year}
          variant="outline"
          size="icon"
          type="button"
          onClick={async () => {
            const newYear = year + 1;
            await submitYear(newYear);
          }}
        >
          <Icon icon="ChevronRight" className="size-4" />
        </Button>
      </div>
      <Tooltip title="Senaste året">
        <Button
          variant="outline"
          type="button"
          onClick={async () => {
            await submitYear(mostRecentYear);
          }}
        >
          <p className="md:hidden">Senaste året</p>
          <Icon icon="CalendarCheck" />
        </Button>
      </Tooltip>
    </form>
  );
};

export default Year;
