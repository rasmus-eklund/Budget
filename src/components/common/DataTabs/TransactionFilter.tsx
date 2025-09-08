import type { SortOption } from "~/types";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { sortOptions } from "~/lib/constants/sortOptions";
import { useTxFilterStore } from "~/stores/tx-filter-store";
import { useState } from "react";
import { useMediaQuery } from "~/hooks/use-media-query";
import Drawer from "../Drawer";
import { MultiSelect } from "../MultiSelect";

type Props = {
  options: { categories: string[]; people: string[]; accounts: string[] };
};
const TransactionFilter = ({ options }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });
  if (isDesktop) return <Filter options={options} />;
  return (
    <div className="flex items-center px-2 pt-2 absolute right-11 top-1">
      <Drawer icon="Filter" title="Transaktionsfilter">
        <Filter options={options} />
      </Drawer>
    </div>
  );
};

const Filter = ({ options }: Props) => {
  const [search, setSearch] = useState("");
  const { setTxFilter, setTxSort, txFilter, txSort, hasChanged, reset } =
    useTxFilterStore();
  return (
    <form
      className="flex flex-col gap-2 p-1 md:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setTxFilter({ ...txFilter, search });
      }}
    >
      <MultiSelect
        options={options.people}
        items={txFilter.person}
        setItems={(items) => setTxFilter({ ...txFilter, person: items })}
        label="Person"
      />
      <MultiSelect
        options={options.categories}
        items={txFilter.category}
        setItems={(items) => setTxFilter({ ...txFilter, category: items })}
        label="Kategori"
      />
      <MultiSelect
        options={options.accounts}
        items={txFilter.account}
        setItems={(items) => setTxFilter({ ...txFilter, account: items })}
        label="Konto"
      />
      <Input
        placeholder="Sök"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <div className="flex items-center gap-2">
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
      </div>
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
