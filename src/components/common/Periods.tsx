"use client";
import { useMemo } from "react";
import { Icon, LabeledSwitch, Tooltip } from "~/components/common";
import { Button } from "~/components/ui";
import { cn, getPeriodCount, isPeriodIncludedInAverage, toSek } from "~/lib";
import { useStore } from "~/stores/tx-store";
import type { PeriodGroupBy, Tx, Uniques } from "~/types";

type Props = {
  data: Tx[];
  options: Uniques;
};

type CategorySums = Record<string, number>;
type PersonCategorySums = Record<string, CategorySums>;
type AggregatedPeriod = {
  period: string;
  users: PersonCategorySums;
};
type VisibleColumn = {
  category: string;
  person?: string;
  label: string;
  key: string;
};

const formatPeriod = (date: Date, groupBy: PeriodGroupBy) => {
  const year = date.getFullYear();
  if (groupBy === "year") {
    return `${year}`;
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const aggregateByPeriod = ({
  data,
  groupBy,
  people,
  categories,
}: {
  data: Tx[];
  groupBy: PeriodGroupBy;
  people: string[];
  categories: string[];
}): AggregatedPeriod[] => {
  const periodMap: Record<string, PersonCategorySums> = {};

  for (const tx of data) {
    const period = formatPeriod(tx.datum, groupBy);
    if (!periodMap[period]) {
      periodMap[period] = {};
    }
    const periodUsers = periodMap[period];
    if (!periodUsers[tx.person]) {
      periodUsers[tx.person] = {};
    }
    const personSums = periodUsers[tx.person]!;
    personSums[tx.budgetgrupp] = (personSums[tx.budgetgrupp] ?? 0) + tx.belopp;
  }

  const sortedPeriods = Object.keys(periodMap).sort((a, b) =>
    a.localeCompare(b),
  );

  return sortedPeriods.map((period) => {
    const users = periodMap[period]!;
    for (const person of people) {
      if (!users[person]) {
        users[person] = {};
      }
      for (const category of categories) {
        if (users[person][category] === undefined) {
          users[person][category] = 0;
        }
      }
    }
    return { period, users };
  });
};

const Monthly = ({ data, options }: Props) => {
  const groupBy = useStore((state) => state.periodGroupBy);
  const setGroupBy = useStore((state) => state.setPeriodGroupBy);
  const collapsePeople = useStore((state) => state.collapsePeriodPeople);
  const setCollapsePeople = useStore((state) => state.setCollapsePeriodPeople);
  const sticky = useStore((state) => state.sticky);
  const setSticky = useStore((state) => state.setSticky);
  const selectedRange = useStore((state) => state.selectedRange);

  const aggregated = useMemo(
    () =>
      aggregateByPeriod({
        data,
        groupBy,
        people: options.person,
        categories: options.category,
      }),
    [data, groupBy, options.category, options.person],
  );

  const visibleCategories = useMemo(
    () =>
      options.category.filter((category) =>
        aggregated.some((period) =>
          options.person.some(
            (person) => period.users[person]?.[category] !== 0,
          ),
        ),
      ),
    [aggregated, options.category, options.person],
  );

  const visiblePeople = useMemo(
    () =>
      options.person.filter((person) =>
        visibleCategories.some((category) =>
          aggregated.some((period) => period.users[person]?.[category] !== 0),
        ),
      ),
    [aggregated, options.person, visibleCategories],
  );

  const visibleColumns = useMemo<VisibleColumn[]>(() => {
    if (collapsePeople) {
      return visibleCategories.map((category) => ({
        category,
        key: category,
        label: "Summa",
      }));
    }

    return visibleCategories.flatMap((category) =>
      visiblePeople.map((person) => ({
        category,
        key: `${category}-${person}`,
        label: person,
        person,
      })),
    );
  }, [collapsePeople, visibleCategories, visiblePeople]);

  const columnTotals = useMemo(() => {
    const totals = visibleColumns.map(() => 0);
    const averageTotals = visibleColumns.map(() => 0);
    let grandTotal = 0;
    let averageGrandTotal = 0;

    for (const period of aggregated) {
      const periodIncludedInAverage = isPeriodIncludedInAverage(
        period.period,
        groupBy,
        selectedRange,
      );

      visibleColumns.forEach(({ category, person }, index) => {
        const value = person
          ? (period.users[person]?.[category] ?? 0)
          : visiblePeople.reduce(
              (sum, visiblePerson) =>
                sum + (period.users[visiblePerson]?.[category] ?? 0),
              0,
            );
        totals[index] = (totals[index] ?? 0) + value;
        grandTotal += value;

        if (periodIncludedInAverage) {
          averageTotals[index] = (averageTotals[index] ?? 0) + value;
          averageGrandTotal += value;
        }
      });
    }

    const periodCount = getPeriodCount(selectedRange, groupBy);
    const averages =
      periodCount === 0
        ? averageTotals.map(() => 0)
        : averageTotals.map((total) => total / periodCount);
    const grandAverage =
      periodCount === 0 ? 0 : averageGrandTotal / periodCount;

    return { totals, grandTotal, averages, grandAverage };
  }, [aggregated, groupBy, selectedRange, visibleColumns, visiblePeople]);

  const stickyClass = "sticky left-0 z-10";
  const headClass =
    "px-4 py-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground";
  const totalClass = "bg-secondary font-semibold text-foreground";
  const averageLabel = groupBy === "month" ? "Snitt/Månad" : "Snitt/År";
  const categoryColumnSpan = collapsePeople ? 1 : visiblePeople.length;
  const categoryBorderClass = "border-x border-border";
  const categoryStartBorderClass = "border-l border-border";
  const categoryEndBorderClass = "border-r border-border";
  const getCategoryBoundaryClass = (index: number) =>
    cn(
      categoryColumnSpan > 0 &&
        index % categoryColumnSpan === 0 &&
        categoryStartBorderClass,
      categoryColumnSpan > 0 &&
        index % categoryColumnSpan === categoryColumnSpan - 1 &&
        categoryEndBorderClass,
    );
  const getColumnValue = (row: AggregatedPeriod, column: VisibleColumn) => {
    if (column.person) {
      return row.users[column.person]?.[column.category] ?? 0;
    }

    return visiblePeople.reduce(
      (sum, person) => sum + (row.users[person]?.[column.category] ?? 0),
      0,
    );
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 p-1">
        <LabeledSwitch
          id="period-group-by"
          className="w-26"
          checked={groupBy === "year"}
          onCheckedChange={(checked) => setGroupBy(checked ? "year" : "month")}
          label={groupBy === "month" ? "Månad" : "År"}
          ariaLabel="Växla mellan månad och år"
        />
        <LabeledSwitch
          id="collapse-people"
          checked={collapsePeople}
          onCheckedChange={setCollapsePeople}
          label="Summera personer"
        />
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="sticky top-0 z-20 bg-secondary">
            <tr>
              <th
                rowSpan={collapsePeople ? 1 : 2}
                className={cn(
                  headClass,
                  "bg-secondary text-left",
                  sticky && stickyClass,
                )}
              >
                <div className="flex items-center gap-1">
                  <p>Date</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSticky(!sticky)}
                  >
                    <Icon icon={sticky ? "PinOff" : "Pin"} />
                  </Button>
                </div>
              </th>

              {visibleCategories.map((category) => (
                <th
                  key={category}
                  colSpan={categoryColumnSpan}
                  className={cn(
                    headClass,
                    "bg-secondary text-center",
                    categoryBorderClass,
                  )}
                >
                  {category}
                </th>
              ))}
              <th
                rowSpan={collapsePeople ? 1 : 2}
                className={cn(headClass, "bg-secondary text-right")}
              >
                Total
              </th>
            </tr>

            {!collapsePeople && (
              <tr>
                {visibleColumns.map((column, index) => (
                  <th
                    key={column.key}
                    className={cn(
                      "bg-secondary px-3 py-2 text-right text-xs font-medium tracking-wider text-muted-foreground first-letter:capitalize",
                      getCategoryBoundaryClass(index),
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-secondary bg-background">
            {aggregated.map((row) => {
              const periodIncludedInAverage = isPeriodIncludedInAverage(
                row.period,
                groupBy,
                selectedRange,
              );
              const rowTotal = visibleColumns.reduce(
                (sum, column) => sum + getColumnValue(row, column),
                0,
              );

              return (
                <tr key={row.period}>
                  <td
                    className={cn(
                      "bg-white px-4 py-2 align-top font-medium whitespace-nowrap",
                      sticky && stickyClass,
                    )}
                  >
                    <div className="flex items-start gap-1">
                      <span>{row.period}</span>
                      {!periodIncludedInAverage && (
                        <Tooltip title="Raden ingår inte i snittet då perioden inte är komplett.">
                          <span className="cursor-help text-muted-foreground">
                            *
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </td>

                  {visibleColumns.map((column, index) => {
                    const value = getColumnValue(row, column);
                    return (
                      <td
                        key={`${row.period}-${column.key}`}
                        className={cn(
                          "px-3 py-2 text-right text-sm whitespace-nowrap",
                          getCategoryBoundaryClass(index),
                          value < 0 && "text-primary",
                        )}
                      >
                        {toSek(value)}
                      </td>
                    );
                  })}

                  <td
                    className={cn(
                      "px-3 py-2 text-right text-sm whitespace-nowrap",
                      totalClass,
                      rowTotal < 0 && "text-primary",
                    )}
                  >
                    {toSek(rowTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="sticky bottom-0 z-20 bg-secondary">
            <tr>
              <td
                className={cn(
                  "px-4 py-2 font-semibold whitespace-nowrap",
                  totalClass,
                  sticky && stickyClass,
                )}
              >
                Total
              </td>
              {columnTotals.totals.map((value, index) => (
                <td
                  key={`${visibleColumns[index]!.key}-total`}
                  className={cn(
                    "px-3 py-2 text-right text-sm whitespace-nowrap",
                    totalClass,
                    getCategoryBoundaryClass(index),
                    value < 0 && "text-primary",
                  )}
                >
                  {toSek(value)}
                </td>
              ))}
              <td
                className={cn(
                  "px-3 py-2 text-right text-sm whitespace-nowrap",
                  totalClass,
                  columnTotals.grandTotal < 0 && "text-primary",
                )}
              >
                {toSek(columnTotals.grandTotal)}
              </td>
            </tr>
            <tr>
              <td
                className={cn(
                  "px-4 py-2 font-semibold whitespace-nowrap",
                  totalClass,
                  sticky && stickyClass,
                )}
              >
                {averageLabel}
              </td>
              {columnTotals.averages.map((value, index) => (
                <td
                  key={`${visibleColumns[index]!.key}-average`}
                  className={cn(
                    "px-3 py-2 text-right text-sm whitespace-nowrap",
                    totalClass,
                    getCategoryBoundaryClass(index),
                    value < 0 && "text-primary",
                  )}
                >
                  {toSek(value)}
                </td>
              ))}
              <td
                className={cn(
                  "px-3 py-2 text-right text-sm whitespace-nowrap",
                  totalClass,
                  columnTotals.grandAverage < 0 && "text-primary",
                )}
              >
                {toSek(columnTotals.grandAverage)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Monthly;
