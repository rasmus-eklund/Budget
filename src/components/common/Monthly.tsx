"use client";
import { useMemo, useState } from "react";
import { Icon } from "~/components/common";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";
import { cn, toSek } from "~/lib";
import { useStore } from "~/stores/tx-store";
import type { Tx, Uniques } from "~/types";

type Props = {
  data: Tx[];
  options: Uniques;
};

type GroupBy = "month" | "year";
type CategorySums = Record<string, number>;
type PersonCategorySums = Record<string, CategorySums>;
type AggregatedPeriod = {
  period: string;
  users: PersonCategorySums;
};

const formatPeriod = (date: Date, groupBy: GroupBy) => {
  const year = date.getUTCFullYear();
  if (groupBy === "year") {
    return `${year}`;
  }
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const aggregateByPeriod = ({
  data,
  groupBy,
  people,
  categories,
}: {
  data: Tx[];
  groupBy: GroupBy;
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
  const [groupBy, setGroupBy] = useState<GroupBy>("month");
  const sticky = useStore((state) => state.sticky);
  const setSticky = useStore((state) => state.setSticky);

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

  const stickyClass = "sticky left-0 z-10";
  const headClass =
    "px-4 py-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="w-45">
        <Select
          value={groupBy}
          onValueChange={(value) => setGroupBy(value as GroupBy)}
        >
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Månad</SelectItem>
            <SelectItem value="year">År</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-h-0 flex-1 overflow-auto py-2">
        <table className="min-w-full divide-y divide-secondary">
          <thead className="sticky top-0 z-20 bg-secondary">
            <tr>
              <th
                rowSpan={2}
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
                  colSpan={visiblePeople.length}
                  className={cn(headClass, "bg-secondary text-center")}
                >
                  {category}
                </th>
              ))}
            </tr>

            <tr>
              {visibleCategories.flatMap((category) =>
                visiblePeople.map((person) => (
                  <th
                    key={`${category}-${person}`}
                    className="bg-secondary px-3 py-2 text-right text-xs font-medium tracking-wider text-muted-foreground first-letter:capitalize"
                  >
                    {person}
                  </th>
                )),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-secondary bg-background">
            {aggregated.map((row) => (
              <tr key={row.period}>
                <td
                  className={cn(
                    "bg-white px-4 py-2 align-top font-medium whitespace-nowrap",
                    sticky && stickyClass,
                  )}
                >
                  {row.period}
                </td>

                {visibleCategories.flatMap((category) =>
                  visiblePeople.map((person) => {
                    const value = row.users[person]?.[category] ?? 0;
                    return (
                      <td
                        key={`${row.period}-${category}-${person}`}
                        className={cn(
                          "px-3 py-2 text-right text-sm whitespace-nowrap",
                          value < 0 && "text-primary",
                        )}
                      >
                        {value === 0 ? "-" : toSek(value)}
                      </td>
                    );
                  }),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monthly;
