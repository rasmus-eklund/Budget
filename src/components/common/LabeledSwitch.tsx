"use client";

import { Switch } from "~/components/ui";
import { cn } from "~/lib";

const LabeledSwitch = ({
  checked,
  id,
  label,
  onCheckedChange,
  ariaLabel,
  className,
}: {
  checked: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-2 shadow-xs select-none dark:bg-input/30",
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      <Switch
        id={id}
        size="sm"
        checked={checked}
        onCheckedChange={onCheckedChange}
        onClick={(event) => event.stopPropagation()}
        aria-label={ariaLabel ?? label}
      />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
};

export default LabeledSwitch;
