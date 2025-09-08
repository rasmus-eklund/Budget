import { useMemo } from "react";
import calculateSums from "~/lib/utils/calculateSums";
import capitalize from "~/lib/utils/capitalize";
import { dateToString, toSek } from "~/lib/utils/formatData";
import { getFromTo } from "~/lib/utils/dateCalculations";
import type { FromTo } from "~/lib/zodSchemas";
import type { Uniques, Tx } from "~/types";
import { cn } from "~/lib/utils";
import { useTxFilterStore } from "~/stores/tx-filter-store";

type Props = {
  data: Tx[];
  options: Uniques;
};

const Aggregated = ({ data, options: { people, categories } }: Props) => {
  const sumsMemo = useMemo(
    () => calculateSums({ data, categories, people }),
    [data, people, categories],
  );
  const peopleTotal = [...people, "total"];
  const nonClickableCategories = ["spending", "total"];
  const categoriesTotal = [...categories, ...nonClickableCategories].filter(
    (i) => i != "inom",
  );
  const dates = getFromTo(data);
  const getDateString = ({ from, to }: FromTo) => {
    const f = dateToString(from);
    const t = dateToString(to);
    return f !== t ? `${f} - ${t}` : f;
  };

  const catClass =
    "px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground";
  return (
    <div className="overflow-x-auto py-2">
      {dates ? <h2 className="p-2 text-lg">{getDateString(dates)}</h2> : null}
      <table className="min-w-full divide-y divide-secondary">
        <thead className="bg-secondary">
          <tr>
            <th className={cn(catClass, "text-left")}>Kategori</th>
            {peopleTotal.map((person) => (
              <th key={person}>
                {person === "total" ? (
                  <p className={cn(catClass, "text-right")}>{person}</p>
                ) : (
                  <CatButton
                    className={cn(catClass, "w-full text-right")}
                    person={person}
                  >
                    {person}
                  </CatButton>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary bg-background">
          {categoriesTotal.map((category, categoryIndex) => (
            <tr key={category}>
              <td className="whitespace-nowrap px-4 font-semibold tracking-wider">
                {nonClickableCategories.includes(category) ? (
                  capitalize(category === "spending" ? "Utgifter" : category)
                ) : (
                  <CatButton category={category}>
                    {capitalize(
                      category === "spending" ? "Utgifter" : category,
                    )}
                  </CatButton>
                )}
              </td>
              {peopleTotal.map((person, index) => {
                const sek = sumsMemo[category]![person]!;
                return (
                  <td
                    className={cn(
                      "px-4 py-1 text-right",
                      sek < 0 && "text-primary",
                      index === peopleTotal.length - 1 && "font-semibold",
                      categoryIndex >= categoriesTotal.length - 2 &&
                        "font-bold",
                    )}
                    key={`${category}${person}`}
                  >
                    {nonClickableCategories.includes(category) ? (
                      <p>{toSek(sek)}</p>
                    ) : (
                      <CatButton
                        category={category}
                        person={person !== "total" ? person : undefined}
                      >
                        {toSek(sek)}
                      </CatButton>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type CatButtonProps = {
  children: React.ReactNode;
  className?: string;
  category?: string;
  person?: string;
};
const CatButton = ({
  children,
  className,
  category,
  person,
}: CatButtonProps) => {
  const { setTxFilter, defaultTxFilter, setTab } = useTxFilterStore();
  return (
    <button
      className={cn("cursor-pointer hover:scale-110", className)}
      onClick={() => {
        console.log({ defaultTxFilter, clicked: { category, person } });
        setTxFilter({
          category: category ? [category] : defaultTxFilter.category,
          account: defaultTxFilter.account,
          person: person ? [person] : defaultTxFilter.person,
          search: "",
        });
        setTab("transactions");
      }}
    >
      {children}
    </button>
  );
};
export default Aggregated;
