"use client";

import type { SortOption, TextFilterMode, Uniques } from "~/types";
import {
  Select,
  Button,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";
import {
  FreeTextMultiCombobox,
  LabeledSwitch,
  MultiSelect,
} from "~/components/common";
import { sortOptions } from "~/constants";
import { useStore } from "~/stores/tx-store";
import { cn, setAll } from "~/lib";

const TransactionFilter = ({ options }: { options: Uniques }) => {
  const { account, category, person } = options;
  const setTxSort = useStore((state) => state.setTxSort);
  const reset = useStore((state) => state.reset);
  const setFilter = useStore((state) => state.setFilter);
  const txSort = useStore((state) => state.txSort);
  const hasChanged = useStore((state) => state.hasChanged);
  const filter = useStore((state) => state.filter);
  const showFilter = useStore((state) => state.showFilter);
  const filterTab = useStore((state) => state.filterTab);

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-1 pt-2 md:flex-nowrap",
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

      <SearchFilter
        mode={filter.search.mode}
        terms={filter.search.terms}
        onModeChange={(mode) =>
          setFilter({ ...filter, search: { ...filter.search, mode } })
        }
        onTermsChange={(terms) =>
          setFilter({ ...filter, search: { ...filter.search, terms } })
        }
      />
      {hasChanged && (
        <Button type="button" onClick={reset}>
          Rensa filter
        </Button>
      )}
      {["aggregated", "transactions"].includes(filterTab) && (
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
              <SelectItem value={sortOptions.dateDesc}>
                Datumfallande
              </SelectItem>
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
      )}
    </div>
  );
};

const SearchFilter = ({
  mode,
  terms,
  onModeChange,
  onTermsChange,
}: {
  mode: TextFilterMode;
  terms: string[];
  onModeChange: (mode: TextFilterMode) => void;
  onTermsChange: (terms: string[]) => void;
}) => {
  return (
    <div className="flex min-w-0 items-start gap-1">
      <LabeledSwitch
        id="search-filter-mode"
        checked={mode === "exclude"}
        onCheckedChange={(checked) =>
          onModeChange(checked ? "exclude" : "include")
        }
        label={mode === "include" ? "Inkludera" : "Exkludera"}
        ariaLabel="Växla mellan inkludera och exkludera"
      />
      <FreeTextMultiCombobox
        placeholder="Sök text"
        value={terms}
        onValueChange={onTermsChange}
      />
    </div>
  );
};

export default TransactionFilter;
