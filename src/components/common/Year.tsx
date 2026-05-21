"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "~/components/ui";
import { Icon, Tooltip } from "~/components/common";
import { getYearRange } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";
import { useStore } from "~/stores/tx-store";

type Props = {
  changeDate: (dates: FromTo) => void;
};

const Year = ({ changeDate }: Props) => {
  const { from, to } = useStore((state) => state.range);
  const draftRange = useStore((state) => state.draftRange);
  const year = draftRange.from.getFullYear();
  const mostRecentYear = to.getFullYear();
  const submitYear = async (year: number) => {
    await changeDate({
      from: new Date(Date.UTC(year, 0, 1)),
      to: new Date(Date.UTC(year + 1, 0, 0)),
    });
  };
  const years = getYearRange({ from, to });
  return (
    <form
      className="flex flex-col gap-1 md:flex-row md:items-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-1">
        <Button
          disabled={from.getFullYear() === year}
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
