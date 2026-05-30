"use client";

import { useMemo } from "react";
import {
  allFalseExcept,
  allTrueExcept,
  calculateSums,
  cn,
  dateToString,
  getFromTo,
  toSek,
} from "~/lib";
import type { Uniques } from "~/types";
import { Button } from "~/components/ui";
import { Icon } from "~/components/common";
import { useStore } from "~/stores/tx-store";

type Props = {
  options: Uniques;
};

const NON_CLICKABLE_CATEGORIES = ["spending", "total"] as const;
const INTERNAL_CATEGORY = "inom";
const DISPLAY_NAME_BY_CATEGORY: Record<string, string> = {
  spending: "Utgifter",
};

const useAggregatedFilterActions = () => {
  const setFilter = useStore((state) => state.setFilter);
  const setFilterTab = useStore((state) => state.setFilterTab);
  const defaultFilter = useStore((state) => state.filter);

  return ({ category, person }: { category?: string; person?: string }) => {
    setFilter({
      category: category
        ? allFalseExcept(defaultFilter.category, category)
        : allTrueExcept(defaultFilter.category, INTERNAL_CATEGORY),
      account: defaultFilter.account,
      person: person
        ? allFalseExcept(defaultFilter.person, person)
        : allTrueExcept(defaultFilter.person, INTERNAL_CATEGORY),
      search: "",
    });
    setFilterTab("transactions");
  };
};

const useAggregatedTableModel = ({
  txs,
  person,
  category,
}: {
  txs: ReturnType<typeof useStore.getState>["txs"];
  person: string[];
  category: string[];
}) => {
  const sums = useMemo(
    () => calculateSums({ data: txs, category, person }),
    [txs, person, category],
  );
  const sticky = useStore((state) => state.sticky);
  const setSticky = useStore((state) => state.setSticky);

  const rowCategories = useMemo(
    () =>
      [...category, ...NON_CLICKABLE_CATEGORIES].filter(
        (cat) => cat !== INTERNAL_CATEGORY,
      ),
    [category],
  );

  const visiblePeopleTotal = useMemo(
    () =>
      [...person, "total"].filter(
        (p) =>
          p === "total" ||
          rowCategories.some((cat) => (sums[cat]?.[p] ?? 0) !== 0),
      ),
    [person, rowCategories, sums],
  );

  const datesLabel = useMemo(() => {
    const dates = getFromTo(txs);
    if (!dates) {
      return undefined;
    }
    const f = dateToString(dates.from);
    const t = dateToString(dates.to);
    return f !== t ? `${f} - ${t}` : f;
  }, [txs]);

  return {
    sums,
    sticky,
    setSticky,
    rowCategories,
    visiblePeopleTotal,
    datesLabel,
  };
};

const Aggregated = ({ options: { person, category } }: Props) => {
  const txs = useStore((state) => state.txs);
  const {
    sums,
    sticky,
    setSticky,
    rowCategories,
    visiblePeopleTotal,
    datesLabel,
  } = useAggregatedTableModel({
    txs,
    person,
    category,
  });
  const applyFilter = useAggregatedFilterActions();

  const stickyClass = "sticky left-0 z-10";
  const catClass =
    "px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <div className="flex-1 overflow-auto py-2">
      {datesLabel ? (
        <h2 className={cn("p-2 text-lg", stickyClass)}>{datesLabel}</h2>
      ) : null}
      <table className="min-w-full divide-y divide-secondary">
        <thead className="bg-secondary">
          <tr>
            <th
              className={cn(
                catClass,
                "flex items-center gap-1 bg-secondary text-left",
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
            {visiblePeopleTotal.map((p) => (
              <th key={p}>
                {p === "total" ? (
                  <p className={cn(catClass, "text-right")}>{p}</p>
                ) : (
                  <CatButton
                    className={cn(catClass, "w-full text-right")}
                    onClick={() => applyFilter({ person: p })}
                  >
                    {p}
                  </CatButton>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary bg-background">
          {rowCategories.map((cat, categoryIndex) => {
            const isSummaryRow = categoryIndex >= rowCategories.length - 2;
            const displayName = DISPLAY_NAME_BY_CATEGORY[cat] ?? cat;
            const isStaticRow = NON_CLICKABLE_CATEGORIES.includes(
              cat as (typeof NON_CLICKABLE_CATEGORIES)[number],
            );

            return (
              <tr key={cat}>
                <td
                  className={cn(
                    "bg-white px-4 font-semibold tracking-wider whitespace-nowrap first-letter:capitalize",
                    sticky && stickyClass,
                  )}
                >
                  {isStaticRow ? (
                    displayName
                  ) : (
                    <CatButton onClick={() => applyFilter({ category: cat })}>
                      {displayName}
                    </CatButton>
                  )}
                </td>

                {visiblePeopleTotal.map((p, index) => {
                  const value = sums[cat]?.[p] ?? 0;
                  const isLastColumn = index === visiblePeopleTotal.length - 1;
                  return (
                    <td
                      key={`${cat}${p}`}
                      className={cn(
                        "px-4 py-1 text-right",
                        value < 0 && "text-primary",
                        isLastColumn && "font-semibold",
                        isSummaryRow && "font-bold",
                      )}
                    >
                      {isStaticRow ? (
                        <p>{toSek(value)}</p>
                      ) : (
                        <CatButton
                          onClick={() =>
                            applyFilter({
                              category: cat,
                              person: p !== "total" ? p : undefined,
                            })
                          }
                        >
                          {toSek(value)}
                        </CatButton>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CatButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "cursor-pointer first-letter:capitalize hover:scale-110",
      className,
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Aggregated;
