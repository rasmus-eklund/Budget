import type { TxSort, TxFilter } from "~/types";
import capitalize from "~/lib/utils/capitalize";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "~/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Button } from "~/components/ui/button";
import { useState } from "react";

type Filters = { txFilter: TxFilter; txSort: TxSort };
type Props = {
  options: { categories: string[]; people: string[]; accounts: string[] };
  filters: Filters;
  defaults: Filters;
  setFilters: {
    setTxFilter: (txFilter: TxFilter) => void;
    setTxSort: (txSort: TxSort) => void;
  };
};
const TransactionFilter = ({
  options,
  defaults,
  filters: { txFilter, txSort },
  setFilters: { setTxFilter, setTxSort },
}: Props) => {
  const [search, setSearch] = useState("");

  return (
    <>
      <form
        className="flex flex-col gap-2 p-1 md:flex-row md:justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          setTxFilter({ ...txFilter, search });
        }}
      >
        <div className="flex items-center gap-2">
          <Select
            value={txFilter.category}
            onValueChange={(value) =>
              setTxFilter({ ...txFilter, category: value })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {options.categories.map((i) => (
                <SelectItem key={i} value={i}>
                  {capitalize(i)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={txFilter.person}
            onValueChange={(value) =>
              setTxFilter({ ...txFilter, person: value })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Person" />
            </SelectTrigger>
            <SelectContent>
              {options.people.map((i) => (
                <SelectItem key={i} value={i}>
                  {capitalize(i)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={txFilter.account}
            onValueChange={(value) =>
              setTxFilter({ ...txFilter, account: value })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Konto" />
            </SelectTrigger>
            <SelectContent>
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
        </div>
        <div className="mr-auto flex items-center gap-2">
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
          {Object.values(txFilter).some((i) => i) && (
            <Button
              type="button"
              onClick={() => setTxFilter(defaults.txFilter)}
            >
              Rensa filter
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sort">Sortera efter:</Label>
          <Select
            value={txSort.belopp as string}
            defaultValue={"Datum (Lågt-Högt)"}
            onValueChange={(value) => setTxSort({ ...txSort, belopp: value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue defaultValue={""} placeholder="Konto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Datum</SelectLabel>
                <SelectItem value={"Datum (Lågt-Högt)"}>
                  Senast först
                </SelectItem>
                <SelectItem value={"Datum (Högt-Lågt)"}>Älst först</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Belopp</SelectLabel>
                <SelectItem value={"Belopp (Lågt-Högt)"}>Lågt-Högt</SelectItem>
                <SelectItem value={"Belopp (Högt-Lågt)"}>Högt-Lågt</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </form>
    </>
  );
};

export default TransactionFilter;
