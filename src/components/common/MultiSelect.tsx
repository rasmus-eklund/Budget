"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
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

type Item = string;
export function MultiSelect({
  label,
  items,
  options,
  setItems,
}: {
  label: string;
  options: string[];
  items: string[];
  setItems: (items: string[]) => void;
}) {
  return (
    <Popover>
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
      <PopoverContent className="w-fit p-0">
        <Command>
          <CommandInput placeholder="Sök" className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => {
                const checked = items.includes(item);
                return (
                  <Item
                    key={item}
                    item={item}
                    checked={checked}
                    onSelect={(i) => setItems(onSelect(i, items, checked))}
                  />
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex items-center gap-1 p-1">
          <Button
            onClick={() => setItems(options)}
            className="flex-1"
            variant="outline"
          >
            Alla
          </Button>
          <Button
            onClick={() => setItems([])}
            className="flex-1"
            variant="outline"
          >
            Inga
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type Props = { item: Item; onSelect: (i: Item) => void; checked: boolean };
const Item = ({ item, onSelect, checked }: Props) => {
  return (
    <CommandItem
      value={item}
      onSelect={() => {
        onSelect(item);
      }}
    >
      {capitalize(item)}
      <Check className={cn("ml-auto", checked ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
};

const onSelect = (i: Item, items: Item[], checked: boolean) =>
  checked ? items.filter((item) => item !== i) : [...items, i];
