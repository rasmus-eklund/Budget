"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";

export type SelectOption = {
  value: string;
  label: ReactNode;
  className?: string;
};

export type SelectOptionGroup = {
  groupLabel: string;
  options: SelectOption[];
};

type SimpleSelectProps = {
  options: SelectOption[] | SelectOptionGroup[];
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  testId?: string;
};

function isGrouped(options: SelectOption[] | SelectOptionGroup[]): options is SelectOptionGroup[] {
  return options.length > 0 && options[0] !== undefined && "groupLabel" in options[0];
}

const SimpleSelect = ({
  options,
  value,
  onValueChange,
  placeholder,
  triggerClassName = "w-full md:w-fit max-w-96",
  testId,
}: SimpleSelectProps) => {
  const flatOptions = isGrouped(options) ? options.flatMap((g) => g.options) : options;
  const items = flatOptions.map(({ value, label }) => ({ value, label }));

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        if (val !== null) {
          onValueChange(val);
        }
      }}
      items={items}
    >
      <SelectTrigger className={triggerClassName} data-testid={testId}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isGrouped(options)
          ? options.map((group) => (
              <SelectGroup key={group.groupLabel}>
                <SelectLabel>{group.groupLabel}</SelectLabel>
                {group.options.map(({ value, label, className }) => (
                  <SelectItem key={value} value={value} className={className}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          : options.map(({ value, label, className }) => (
              <SelectItem key={value} value={value} className={className}>
                {label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
};

export default SimpleSelect;
