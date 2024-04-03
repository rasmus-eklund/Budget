import { useState, type ReactNode } from "react";
import type { TxSort, TxFilter } from "~/types";
import capitalize from "~/lib/utils/capitalize";

const sortOptions = [
  "Datum (Lågt-Högt)",
  "Datum (Högt-Lågt)",
  "Belopp (Lågt-Högt)",
  "Belopp (Högt-Lågt)",
] as const;
type tOption = (typeof sortOptions)[number];

type Props = {
  options: { categories: string[]; people: string[]; accounts: string[] };
  children: ({
    txFilter,
    txSort,
  }: {
    txFilter: TxFilter;
    txSort: TxSort;
  }) => ReactNode;
};
const TransactionFilter = ({ options, children }: Props) => {
  const defaultTxFilter: TxFilter = {
    category: "",
    person: "",
    account: "",
    inom: false,
  };
  const [txFilter, setTxFilter] = useState<TxFilter>(defaultTxFilter);
  const defaultSortFilter: TxSort = { belopp: "Datum (Lågt-Högt)" };
  const [txSort, setTxSort] = useState<TxSort>(defaultSortFilter);
  const className = {
    select: "bg-black/5",
    label: "text-black/70",
    option: "bg-black/5",
  };
  return (
    <>
      <form
        className="flex flex-col gap-2 p-1 md:flex-row md:justify-between"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex gap-2">
          <select
            value={txFilter.category}
            className={className.select}
            onChange={({ target: { value } }) =>
              setTxFilter((p) => ({ ...p, category: value }))
            }
          >
            <option className={className.option} value={""}>
              Kategori
            </option>
            {options.categories.map((i) => (
              <option className={className.option} key={i} value={i}>
                {capitalize(i)}
              </option>
            ))}
          </select>
          <select
            className={className.select}
            value={txFilter.person}
            onChange={({ target: { value } }) =>
              setTxFilter((p) => ({ ...p, person: value }))
            }
          >
            <option className={className.option} value={""}>
              Person
            </option>
            {options.people.map((person) => (
              <option className={className.option} key={person} value={person}>
                {capitalize(person)}
              </option>
            ))}
          </select>
          <select
            className={className.select}
            value={txFilter.account}
            onChange={({ target: { value } }) =>
              setTxFilter((p) => ({ ...p, account: value }))
            }
          >
            <option className={className.option} value={""}>
              Konto
            </option>
            {options.accounts.map((account) => (
              <option
                className={className.option}
                key={account}
                value={account}
              >
                {capitalize(account)}
              </option>
            ))}
          </select>
          <label className={className.label} htmlFor="inomCheck">
            Visa inom
          </label>
          <input
            id="inomCheck"
            type="checkbox"
            checked={txFilter.inom}
            onChange={() => setTxFilter((p) => ({ ...p, inom: !p.inom }))}
          />
          {Object.values(txFilter).some((i) => i) && (
            <button type="button" onClick={() => setTxFilter(defaultTxFilter)}>
              Återställ
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <label className={className.label} htmlFor="sort">
            Sortera efter:
          </label>
          <select
            id="sort"
            className={className.select}
            onChange={({ target: { value } }) =>
              setTxSort((p) => ({ ...p, belopp: value as tOption }))
            }
          >
            {sortOptions.map((i) => (
              <option className={className.option} key={i} value={i}>
                {capitalize(i)}
              </option>
            ))}
          </select>
        </div>
      </form>
      {children({ txFilter, txSort })}
    </>
  );
};

export default TransactionFilter;
