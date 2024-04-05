import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from "uuid";
import capitalize from "~/lib/utils/capitalize";
import { toSek } from "~/lib/utils/formatData";
import { type Tx } from "~/lib/zodSchemas";
import type { Uniques } from "~/types";

type Props = { data: Tx[]; options: Uniques; loading: boolean };

const Aggregated = ({
  loading,
  data,
  options: { people, categories },
}: Props) => {
  const sumsMemo = useMemo(() => {
    const sums: Record<string, Record<string, number>> = {};
    for (const category of categories) {
      sums[category] = {};
      for (const person of people) {
        sums[category]![person] = 0;
      }
      sums[category]!.total = 0;
    }
    for (const { budgetgrupp, person, belopp } of data) {
      if (budgetgrupp !== "inom") {
        sums[budgetgrupp]![person] += belopp;
      }
    }
    for (const category of categories) {
      sums[category]!.total = Object.keys(sums[category]!).reduce(
        (acc, person) => (acc += sums[category]![person]!),
        0,
      );
    }
    const total: Record<string, number> = {};
    for (const person of people) {
      total[person] = categories.reduce(
        (acc, category) => (acc += sums[category]![person]!),
        0,
      );
    }
    total.total = Object.keys(total).reduce(
      (acc, person) => (acc += total[person]!),
      0,
    );
    sums.total = total;
    return sums;
  }, [data, people, categories]);

  if (loading) {
    return <p>Laddar...</p>;
  }
  const peopleTotal = [...people, "total"];
  const categoriesTotal = [...categories, "total"].filter((i) => i != "inom");

  return (
    <div className="overflow-x-auto py-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Kategori
            </th>
            {peopleTotal.map((person) => (
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                key={uuid()}
              >
                {person}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {categoriesTotal.map((category, categoryIndex) => (
            <tr key={uuid()}>
              <td className="whitespace-nowrap px-4 font-semibold tracking-wider">
                {capitalize(category)}
              </td>
              {peopleTotal.map((person, index) => (
                <td
                  className={twMerge(
                    `px-4 py-1 text-right ${sumsMemo[category]![person]! < 0 ? "text-red-600" : ""} ${index === peopleTotal.length - 1 ? "font-semibold" : ""} ${categoryIndex === categoriesTotal.length - 1 ? "py-2 font-semibold" : ""}`,
                  )}
                  key={uuid()}
                >
                  {toSek(sumsMemo[category]![person]!)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Aggregated;
