"use client";

import { cn } from "~/lib";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
} from "~/components/ui";
import { Icon } from "~/components/common";
import type { FilterItem } from "~/types";

const MultiSelect = ({
  label,
  filterItems,
  options,
  toggleItem,
  clearAll,
  selectAll,
}: {
  label: string;
  options: string[]; // available options from data
  filterItems: FilterItem; // filtered options
  toggleItem: (item: string) => void;
  clearAll: () => void;
  selectAll: () => void;
}) => {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-fit justify-between"
        >
          {label}
          <Icon icon="ChevronsUpDown" className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-(--radix-popover-content-available-height) w-fit overflow-hidden p-0"
        sideOffset={5}
        collisionPadding={10}
      >
        <Command>
          <CommandInput placeholder="Sök" className="h-9" />
          <CommandList className="max-h-[calc(var(--radix-popover-content-available-height)-5.25rem)]">
            <CommandGroup>
              {options.map((item) => {
                const checked = !!filterItems[item];
                return (
                  <CommandItem key={item} value={item} onSelect={toggleItem}>
                    <span className="min-w-0 flex-1 truncate first-letter:uppercase">
                      {item}
                    </span>
                    <Icon
                      icon="Check"
                      className={cn(
                        "ml-auto shrink-0",
                        checked ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex shrink-0 items-center gap-1 p-1">
          <Button onClick={selectAll} className="flex-1" variant="outline">
            Alla
          </Button>
          <Button onClick={clearAll} className="flex-1" variant="outline">
            Inga
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
