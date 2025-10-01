"use client";

import { useMemo } from "react";
import {
  calculateSums,
  capitalize,
  dateToString,
  toSek,
  getFromTo,
  cn,
  allFalseExcept,
  allTrueExcept,
} from "~/lib";
import type { FromTo } from "~/lib/zodSchemas";
import type { Uniques } from "~/types";
import { Button } from "~/components/ui";
import { Icon, Spinner } from "~/components/common";
import { useStore } from "~/stores/tx-store";

type Props = {
  options: Uniques;
};

const Aggregated = ({ options: { person, category } }: Props) => {
  const data = useStore((state) => state.txs);
  const sumsMemo = useMemo(
    () => calculateSums({ data, category, person }),
    [data, person, category],
  );
  const loading = useStore((state) => state.loading);
  const sticky = useStore((state) => state.sticky);
  const { setSticky } = useStore();
  if (loading) return <Spinner />;
  const peopleTotal = [...person, "total"];
  const nonClickableCategories = ["spending", "total"];
  const categoriesTotal = [...category, ...nonClickableCategories].filter(
    (i) => i != "inom",
  );
  const dates = getFromTo(data);
  const getDateString = ({ from, to }: FromTo) => {
    const f = dateToString(from);
    const t = dateToString(to);
    return f !== t ? `${f} - ${t}` : f;
  };

  const stickyClass = "sticky left-0 z-10";
  const catClass =
    "px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground";
  return (
    <div className="overflow-auto py-2">
      {dates ? (
        <h2 className={cn("p-2 text-lg", stickyClass)}>
          {getDateString(dates)}
        </h2>
      ) : null}
      <table className="min-w-full divide-y divide-secondary">
        <thead className="bg-secondary">
          <tr>
            <th
              className={cn(
                catClass,
                "text-left bg-secondary flex items-center gap-1",
                sticky && stickyClass,
              )}
            >
              <p>Kategori</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSticky(!sticky)}
              >
                <Icon icon={sticky ? "PinOff" : "Pin"} />
              </Button>
            </th>
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
              <td
                className={cn(
                  "whitespace-nowrap px-4 font-semibold tracking-wider bg-white",
                  sticky && stickyClass,
                )}
              >
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
  const { setFilter, setFilterTab } = useStore();
  const defaultFilter = useStore((state) => state.filter);
  return (
    <button
      className={cn("cursor-pointer hover:scale-110", className)}
      onClick={() => {
        setFilter({
          category: category
            ? allFalseExcept(defaultFilter.category, category)
            : allTrueExcept(defaultFilter.category, "inom"),
          account: defaultFilter.account,
          person: person
            ? allFalseExcept(defaultFilter.person, person)
            : allTrueExcept(defaultFilter.person, "inom"),
          search: "",
        });
        setFilterTab("transactions");
      }}
    >
      {children}
    </button>
  );
};
export default Aggregated;
