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
import { MultiSelect } from "~/components/common";
import { sortOptions } from "~/constants";
import { useState } from "react";
import { useStore } from "~/stores/tx-store";
import { cn, setAll } from "~/lib";

const TransactionFilter = ({ options }: { options: Uniques }) => {
  const { account, category, person } = options;
  const [search, setSearch] = useState("");
  const { setTxSort, reset, setFilter } = useStore();
  const txSort = useStore((state) => state.txSort);
  const hasChanged = useStore((state) => state.hasChanged);
  const filter = useStore((state) => state.filter);
  const showFilter = useStore((state) => state.showFilter);
  return (
    <form
      className={cn(
        "flex flex-wrap md:flex-nowrap gap-2 p-1 pt-2",
        showFilter ? "" : "hidden",
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setFilter({ ...filter, search });
      }}
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
      <Input
        placeholder="Sök"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
      />
      {hasChanged && (
        <Button
          type="button"
          onClick={() => {
            setSearch("");
            reset();
          }}
        >
          Rensa filter
        </Button>
      )}
      <Select
        value={txSort.sort}
        onValueChange={(value) =>
          setTxSort({ ...txSort, sort: value as SortOption })
        }
      >
        <SelectTrigger className="w-[160px]">
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
    </form>
  );
};

export default TransactionFilter;
