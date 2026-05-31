"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { type FromTo } from "~/lib/zodSchemas";
import DatePickerRange from "./DatePickerRange";
import { useStore } from "~/stores/tx-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";

type Props = { changeDate: (dates: FromTo) => void };
type DatePreset = "6-months" | "1-year" | "3-years" | "5-years" | "all";
type SelectedPreset = DatePreset | "";
type DatePresetOption = {
  label: string;
  value: DatePreset;
  amount?: number;
  unit?: "month" | "year";
};

const datePresets: DatePresetOption[] = [
  { label: "senaste 6 månaderna", value: "6-months", amount: 6, unit: "month" },
  { label: "senaste året", value: "1-year", amount: 1, unit: "year" },
  { label: "senaste 3 åren", value: "3-years", amount: 3, unit: "year" },
  { label: "senaste 5 åren", value: "5-years", amount: 5, unit: "year" },
  { label: "all data", value: "all" },
];

const getPresetDates = (preset: DatePreset, range: FromTo) => {
  if (preset === "all") {
    return range;
  }

  const option = datePresets.find(({ value }) => value === preset);
  const amount = option?.amount ?? 0;
  const unit = option?.unit ?? "month";
  const presetFrom = dayjs(range.to)
    .subtract(amount, unit)
    .startOf(unit)
    .toDate();
  const rangeFrom = dayjs(range.from).startOf(unit).toDate();
  const from = presetFrom < rangeFrom ? rangeFrom : presetFrom;

  return { from, to: dayjs(range.to).endOf(unit).toDate() };
};

const FreeDates = ({ changeDate }: Props) => {
  const draftRange = useStore((state) => state.draftRange);
  const { from, to } = useStore((state) => state.range);
  const [dates, setDates] = useState<FromTo>(draftRange);
  const [selectedPreset, setSelectedPreset] = useState<SelectedPreset>("");

  useEffect(() => {
    setDates(draftRange);
  }, [draftRange]);

  const changeDates = (dates: FromTo) => {
    setSelectedPreset("");
    changeDate(dates);
  };

  const setManualDates = (dates: FromTo) => {
    setSelectedPreset("");
    setDates(dates);
  };

  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-center">
      <DatePickerRange
        className="w-full md:w-fit"
        dates={dates}
        setDate={setManualDates}
        range={{ from, to }}
        onChange={changeDates}
      />
      <Select
        value={selectedPreset}
        onValueChange={(value) => {
          const preset = value as DatePreset;
          const presetDates = getPresetDates(preset, { from, to });
          setSelectedPreset(preset);
          setDates(presetDates);
          changeDate(presetDates);
        }}
      >
        <SelectTrigger className="w-full md:w-52">
          <SelectValue placeholder="Välj period" />
        </SelectTrigger>
        <SelectContent>
          {datePresets.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FreeDates;
