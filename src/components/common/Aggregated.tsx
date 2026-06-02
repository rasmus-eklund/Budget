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
import { emptySearchFilter } from "~/constants";
import type { Uniques } from "~/types";
import { Button } from "~/components/ui";
import { Icon } from "~/components/common";
import { useStore } from "~/stores/tx-store";

type Props = {
  options: Uniques;
};

const SUMMARY_CATEGORIES = ["spending", "total"] as const;
const INTERNAL_CATEGORY = "inom";
const DISPLAY_NAME_BY_CATEGORY: Record<string, string> = {
  spending: "Utgifter",
};

const isSummaryCategory = (
  category: string,
): category is (typeof SUMMARY_CATEGORIES)[number] =>
  SUMMARY_CATEGORIES.includes(category as (typeof SUMMARY_CATEGORIES)[number]);

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
      search: emptySearchFilter,
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
      [...category, ...SUMMARY_CATEGORIES].filter(
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

  const stickyCellClass = "sticky left-0 z-10";
  const headerCellClass =
    "bg-secondary py-1 pl-4 pr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground md:py-3";
  const rowHeaderCellClass =
    "bg-white pl-4 text-xs font-semibold tracking-wider whitespace-nowrap first-letter:capitalize md:text-base";
  const amountCellClass = "pl-4 pr-1 py-1 text-right text-xs md:text-base";
  const headerButtonClass = "inline-block uppercase";
  const rowHeaderButtonClass = "first-letter:capitalize";
  const totalColumnClass = "font-semibold text-foreground";
  const summaryRowClass = "font-bold text-foreground";

  return (
    <div className="flex-1 overflow-auto py-2">
      {datesLabel ? (
        <h2 className={cn("p-2 text-xs md:text-lg", stickyCellClass)}>
          {datesLabel}
        </h2>
      ) : null}
      <table className="min-w-full divide-y divide-secondary">
        <thead className="bg-secondary">
          <tr>
            <th
              className={cn(
                headerCellClass,
                "text-left",
                sticky && stickyCellClass,
              )}
            >
              <div className="flex items-center gap-2">
                <p>Kategori</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSticky(!sticky)}
                >
                  <Icon
                    className="size-3 md:size-4"
                    icon={sticky ? "PinOff" : "Pin"}
                  />
                </Button>
              </div>
            </th>
            {visiblePeopleTotal.map((p) => (
              <th key={p} className={cn(headerCellClass, "text-right")}>
                {p === "total" ? (
                  <p>{p}</p>
                ) : (
                  <CatButton
                    className={headerButtonClass}
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
          {rowCategories.map((cat) => {
            const isSummaryRow = isSummaryCategory(cat);
            const displayName = DISPLAY_NAME_BY_CATEGORY[cat] ?? cat;

            return (
              <tr key={cat}>
                <td
                  className={cn(
                    rowHeaderCellClass,
                    isSummaryRow && summaryRowClass,
                    sticky && stickyCellClass,
                  )}
                >
                  {isSummaryRow ? (
                    displayName
                  ) : (
                    <CatButton
                      className={rowHeaderButtonClass}
                      onClick={() => applyFilter({ category: cat })}
                    >
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
                        amountCellClass,
                        isLastColumn && totalColumnClass,
                        isSummaryRow && summaryRowClass,
                        value < 0 && "text-primary",
                      )}
                    >
                      {isSummaryRow ? (
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
    className={cn("cursor-pointer hover:scale-105", className)}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Aggregated;
