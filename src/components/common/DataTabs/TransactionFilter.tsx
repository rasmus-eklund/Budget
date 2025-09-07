import type { SortOption } from "~/types";
import capitalize from "~/lib/utils/capitalize";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { sortOptions } from "~/lib/constants/sortOptions";
import { useTxFilterStore } from "~/stores/tx-filter-store";
import { useState } from "react";
import { useMediaQuery } from "~/hooks/use-media-query";
import Drawer from "../Drawer";

type Props = {
  options: { categories: string[]; people: string[]; accounts: string[] };
};
const TransactionFilter = ({ options }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
      <Select
        value={txFilter.category}
        onValueChange={(value) => setTxFilter({ ...txFilter, category: value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Kategori</SelectItem>
          <SelectSeparator />
          {options.categories.map((i) => (
            <SelectItem key={i} value={i}>
              {capitalize(i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={txFilter.person}
        onValueChange={(value) => setTxFilter({ ...txFilter, person: value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Person" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Person</SelectItem>
          <SelectSeparator />
          {options.people.map((i) => (
            <SelectItem key={i} value={i}>
              {capitalize(i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={txFilter.account}
        onValueChange={(value) => setTxFilter({ ...txFilter, account: value })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Konto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Konto</SelectItem>
          <SelectSeparator />
          {options.accounts.map((i) => (
            <SelectItem key={i} value={i}>
              {capitalize(i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Sök"
        value={search}
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <div className="flex items-center gap-2">
        <Label className="text-nowrap" htmlFor="inomCheck">
          Visa inom
        </Label>
        <Input
          className="size-5"
          checked={txFilter.inom}
          onChange={() => setTxFilter({ ...txFilter, inom: !txFilter.inom })}
          id="inomCheck"
          type="checkbox"
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
