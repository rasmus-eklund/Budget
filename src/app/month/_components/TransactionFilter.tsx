import { useState, type ReactNode } from "react";
import { type TxFilter } from "~/types";
import capitalize from "~/utils/capitalize";

const sortOptions = ["", "0-9", "9-0"] as const;
type tOption = (typeof sortOptions)[number];
type TxSort = { belopp: tOption };

type Props = {
  options: { categories: string[]; people: string[] };
  children: ({
    txFilter,
    sortFilter,
  }: {
    txFilter: TxFilter;
    sortFilter: TxSort;
  }) => ReactNode;
};
const TransactionFilter = ({ options, children }: Props) => {
  const defaultTxFilter: TxFilter = { category: "", person: "", inom: false };
  const [txFilter, setTxFilter] = useState<TxFilter>(defaultTxFilter);
  const defaultSortFilter: TxSort = { belopp: "" };
  const [sortFilter, setSortFilter] = useState<TxSort>(defaultSortFilter);
  return (
    <>
      <form className="flex gap-2 p-1" onSubmit={(e) => e.preventDefault()}>
        <select
          defaultValue={""}
          onChange={({ target: { value } }) =>
            setTxFilter((p) => ({ ...p, category: value }))
          }
        >
          <option value={""}>Kategori</option>
          {options.categories.map((i) => (
            <option key={i} value={i}>
              {capitalize(i)}
            </option>
          ))}
        </select>
        <select
          defaultValue={""}
          onChange={({ target: { value } }) =>
            setTxFilter((p) => ({ ...p, person: value }))
          }
        >
          <option value={""}>Person</option>
          {options.people.map((person) => (
            <option key={person} value={person}>
              {capitalize(person)}
            </option>
          ))}
        </select>
        <label htmlFor="inomCheck">Visa inom</label>
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
        <label htmlFor="inomCheck">Visa inom</label>
        <select
          defaultValue={""}
          onChange={({ target: { value } }) =>
            setSortFilter((p) => ({ ...p, belopp: value as tOption }))
          }
        >
          <option value={""}>Sortera</option>
          {sortOptions.slice(1).map((i) => (
            <option key={i} value={i}>
              {capitalize(i)}
            </option>
          ))}
        </select>
      </form>
      {children({ txFilter, sortFilter })}
    </>
  );
};

export default TransactionFilter;
