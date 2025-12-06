"use client";
import type { SortOption, Uniques } from "~/types";
import {
  Select,
  Button,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Input,
} from "~/components/ui";
import { Icon, MultiSelect } from "~/components/common";
import { sortOptions } from "~/constants";
import { useEffect, useState } from "react";
import { useStore } from "~/stores/tx-store";
import { cn, setAll } from "~/lib";
import { useDebounceCallback } from "usehooks-ts";

const TransactionFilter = ({ options }: { options: Uniques }) => {
  const { account, category, person } = options;
  const { setTxSort, reset, setFilter } = useStore();
  const txSort = useStore((state) => state.txSort);
  const hasChanged = useStore((state) => state.hasChanged);
  const filter = useStore((state) => state.filter);
  const showFilter = useStore((state) => state.showFilter);
  const debouncedSearch = useDebounceCallback(
    (v: string) => setFilter({ ...filter, search: v }),
    1000,
  );

  return (
    <div
      className={cn(
        "flex flex-wrap md:flex-nowrap gap-2 p-1 pt-2",
        showFilter ? "" : "hidden",
      )}
    >
      <MultiSelect
        options={person}
        filterItems={filter.person}
        toggleItem={(item) => {
          setFilter({
            ...filter,
            person: { ...filter.person, [item]: !filter.person[item] },
          });
        }}
        clearAll={() =>
          setFilter({ ...filter, person: setAll(filter.person, false) })
        }
        selectAll={() =>
          setFilter({ ...filter, person: setAll(filter.person, true) })
        }
        label="Person"
      />
      <MultiSelect
        options={category}
        filterItems={filter.category}
        toggleItem={(item) => {
          setFilter({
            ...filter,
            category: { ...filter.category, [item]: !filter.category[item] },
          });
        }}
        clearAll={() =>
          setFilter({ ...filter, category: setAll(filter.category, false) })
        }
        selectAll={() =>
          setFilter({ ...filter, category: setAll(filter.category, true) })
        }
        label="Kategori"
      />
      <MultiSelect
        options={account}
        filterItems={filter.account}
        toggleItem={(item) => {
          setFilter({
            ...filter,
            account: { ...filter.account, [item]: !filter.account[item] },
          });
        }}
        clearAll={() =>
          setFilter({ ...filter, account: setAll(filter.account, false) })
        }
        selectAll={() =>
          setFilter({ ...filter, account: setAll(filter.account, true) })
        }
        label="Konto"
      />

      <SearchInput
        value={filter.search}
        onChange={debouncedSearch}
        onClear={() => setFilter({ ...filter, search: "" })}
      />
      {hasChanged && (
        <Button type="button" onClick={reset}>
          Rensa filter
        </Button>
      )}
      <Select
        value={txSort.sort}
        onValueChange={(value) =>
          setTxSort({ ...txSort, sort: value as SortOption })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Sortera" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Datum</SelectLabel>
            <SelectItem value={sortOptions.dateAsc}>Datumstigande</SelectItem>
            <SelectItem value={sortOptions.dateDesc}>Datumfallande</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Belopp</SelectLabel>
            <SelectItem value={sortOptions.amountAsc}>
              Lågt till högt
            </SelectItem>
            <SelectItem value={sortOptions.amountDesc}>
              Högt till lågt
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

const SearchInput = ({
  onChange,
  onClear,
  value,
}: {
  onChange: (v: string) => void;
  onClear: () => void;
  value: string;
}) => {
  const [search, setSearch] = useState(value);
  const handleClear = () => {
    setSearch("");
    onClear();
  };

  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <div className="relative">
      <Input
        placeholder="Sök"
        value={search}
        onChange={({ target: { value } }) => {
          setSearch(value);
          onChange(value);
        }}
      />
      <Icon
        onClick={handleClear}
        icon="X"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 hover:scale-110 cursor-pointer transition-transform hidden",
          search !== "" && "block",
        )}
      />
    </div>
  );
};

export default TransactionFilter;
