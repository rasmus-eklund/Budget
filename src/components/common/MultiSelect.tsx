"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import capitalize from "~/lib/utils/capitalize";
import type { FilterItem } from "~/types";

export function MultiSelect({
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
}) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-fit justify-between"
        >
          {label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" popoverTarget="drawer-content">
        <Command>
          <CommandInput placeholder="Sök" className="h-9" />
          <CommandList>
            <CommandGroup>
              {options.map((item) => {
                const checked = !!filterItems[item];
                return (
                  <CommandItem key={item} value={item} onSelect={toggleItem}>
                    {capitalize(item)}
                    <Check
                      className={cn(
                        "ml-auto",
                        checked ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex items-center gap-1 p-1">
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
}
