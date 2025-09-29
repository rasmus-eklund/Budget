"use client";

import { Button } from "~/components/ui";
import { Icon, DatePicker, Tooltip } from "~/components/common";
import { decrementDay, getDayRange, incrementDay, dateToString } from "~/lib";
import { type FromTo } from "~/lib/zodSchemas";
import { useStore } from "~/stores/tx-store";

type Props = { changeDate: (dates: FromTo) => Promise<void> };

const FreeDay = ({ changeDate }: Props) => {
  const { setDay } = useStore();
  const { from, to } = useStore((state) => state.range);
  const day = useStore((state) => state.day);
  const onChange = async (dates: FromTo) => {
    setDay(dates.from);
    await changeDate(dates);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-1 flex-col md:flex-row md:items-center"
    >
      <div className="flex items-center gap-1">
        <Button
          type="button"
          disabled={day <= from}
          variant="outline"
          size="icon"
          onClick={async () => await onChange(decrementDay(day))}
        >
          <Icon icon="ChevronLeft" className="size-4" />
        </Button>
        <DatePicker
          className="w-full md:w-fit"
          range={{ from, to }}
          date={day}
          setDate={async (date) => {
            setDay(date);
            await onChange(getDayRange(dateToString(date)));
          }}
        />
        <Button
          type="button"
          disabled={day >= to}
          variant="outline"
          size="icon"
          onClick={async () => await onChange(incrementDay(day))}
        >
          <Icon icon="ChevronRight" className="size-4" />
        </Button>
      </div>
      <Tooltip title="Senaste dagen">
        <Button
          type="button"
          variant="outline"
          onClick={async () => await onChange(getDayRange(dateToString(to)))}
        >
          <p className="md:hidden">Senaste dagen</p>
          <Icon icon="CalendarCheck" />
        </Button>
      </Tooltip>
    </form>
  );
};

export default FreeDay;
