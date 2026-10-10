"use client";

import { Button } from "~/components/ui";
import { SimpleSelect } from "~/components/common";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
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
  const submitYear = async (year: number) =>
    changeDate({
      from: new Date(Date.UTC(year, 0, 1)),
      to: new Date(Date.UTC(year + 1, 0, 0)),
    });

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
        <SimpleSelect
          value={year.toString()}
          onValueChange={async (year) => {
            const y = Number(year);
            await submitYear(y);
          }}
          options={years.reverse().map((y) => ({
            value: y.toString(),
            label: y,
          }))}
          testId="year-select"
          placeholder=""
        />
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
