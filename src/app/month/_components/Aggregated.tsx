import { useMemo } from "react";
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
    }
    for (const { budgetgrupp, person, belopp } of data) {
      sums[budgetgrupp]![person] += belopp;
    }
    return sums;
  }, [data, people, categories]);

  if (loading) {
    return <p>Laddar...</p>;
  }

  return (
    <div className="overflow-x-auto py-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Kategori
            </th>
            {people.map((person) => (
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
          {categories
            .filter((i) => i != "inom")
            .map((category) => (
              <tr key={uuid()}>
                <td className="whitespace-nowrap p-1 font-semibold tracking-wider">
                  {capitalize(category)}
                </td>
                {people.map((person) => (
                  <td
                    className={`text-right ${sumsMemo[category]![person]! < 0 ? "text-red-600" : ""}`}
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
