"use client";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Icon from "~/components/common/Icon";
import { getYearRange } from "~/lib/utils/dateCalculations";
import { type FromTo } from "~/lib/zodSchemas";
import Tooltip from "../Tooltip";
import { useStore } from "~/stores/tx-store";

type Props = {
  changeDate: (dates: FromTo) => Promise<void>;
};

const Year = ({ changeDate }: Props) => {
  const { from, to } = useStore((state) => state.range);
  const { setYear } = useStore();
  const year = useStore((state) => state.year);
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
      className="flex items-center gap-1"
      onSubmit={(e) => e.preventDefault()}
    >
      <Button
        disabled={from.getFullYear() === year}
        variant="outline"
        type="button"
        size="icon"
        onClick={async () => {
          const newYear = year - 1;
          setYear(newYear);
          await submitYear(newYear);
        }}
      >
        <Icon icon="ChevronLeft" />
      </Button>
      <Select
        value={year.toString()}
        onValueChange={async (year) => {
          const y = Number(year);
          setYear(y);
          await submitYear(y);
        }}
      >
        <SelectTrigger className="w-[90px]">
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
          setYear(newYear);
          await submitYear(newYear);
        }}
      >
        <Icon icon="ChevronRight" className="size-4" />
      </Button>
      <Tooltip title="Senaste året">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={async () => {
            setYear(mostRecentYear);
            await submitYear(mostRecentYear);
          }}
        >
          <Icon icon="CalendarCheck" />
        </Button>
      </Tooltip>
    </form>
  );
};

export default Year;
