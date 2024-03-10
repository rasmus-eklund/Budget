import { useState, type ReactNode } from "react";
import { type TxFilter } from "~/types";
import capitalize from "~/utils/capitalize";

const sortOptions = ["", "Belopp (Lågt-Högt)", "Belopp (Högt-Lågt)"] as const;
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
  const className = {
    select: "bg-gray-50",
    label: "text-black/70",
    option: "bg-gray-100",
  };
  return (
    <>
      <form
        className="flex justify-between p-1"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex gap-2">
          <select
            defaultValue={""}
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
            defaultValue={""}
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
            defaultValue={""}
            onChange={({ target: { value } }) =>
              setSortFilter((p) => ({ ...p, belopp: value as tOption }))
            }
          >
            <option className={className.option} value={""}>
              Datum
            </option>
            {sortOptions.slice(1).map((i) => (
              <option className={className.option} key={i} value={i}>
                {capitalize(i)}
              </option>
            ))}
          </select>
        </div>
      </form>
      {children({ txFilter, sortFilter })}
    </>
  );
};

export default TransactionFilter;
