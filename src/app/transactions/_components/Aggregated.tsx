import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import calculateSums from "~/lib/utils/calculateSums";
import capitalize from "~/lib/utils/capitalize";
import { dateToString, toSek } from "~/lib/utils/formatData";
import { getFromTo } from "~/lib/utils/getYearRange";
import { type Tx } from "~/lib/zodSchemas";
import type { TxFilter, Uniques } from "~/types";

type Props = {
  data: Tx[];
  options: Uniques;
  setFilter: (txFilter: TxFilter) => void;
};

const Aggregated = ({
  data,
  options: { people, categories },
  setFilter,
}: Props) => {
  const sumsMemo = useMemo(
    () => calculateSums({ data, categories, people }),
    [data, people, categories],
  );
  const peopleTotal = [...people, "total"];
  const categoriesTotal = [...categories, "total"].filter((i) => i != "inom");
  const showDates = () => {
    if (data.length === 0) {
      return null;
    }
    const { from, to } = getFromTo(data);
    const f = dateToString(from);
    const t = dateToString(to);
    return <h2 className="p-2 text-lg">{f !== t ? `${f} - ${t}` : f}</h2>;
  };
  return (
    <div className="overflow-x-auto py-2">
      {showDates()}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Kategori
            </th>
            {peopleTotal.map((person) => (
              <th
                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                key={person}
              >
                {person}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {categoriesTotal.map((category, categoryIndex) => (
            <tr key={category}>
              <td className="whitespace-nowrap px-4 font-semibold tracking-wider">
                {capitalize(category)}
              </td>
              {peopleTotal.map((person, index) => {
                const sek = sumsMemo[category]![person]!;
                return (
                  <td
                    className={twMerge(
                      `px-4 py-1 text-right ${sek < 0 ? "text-red-600" : ""} ${index === peopleTotal.length - 1 ? "font-semibold" : ""} ${categoryIndex === categoriesTotal.length - 1 ? "py-2 font-semibold" : ""}`,
                    )}
                    key={`${category}${person}`}
                  >
                    {category === "total" || person === "total" ? (
                      <p>{toSek(sek)}</p>
                    ) : (
                      <button
                        className="hover:scale-110"
                        onClick={() =>
                          setFilter({
                            account: "none",
                            category,
                            inom: false,
                            person,
                            search: "",
                          })
                        }
                      >
                        {toSek(sek)}
                      </button>
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

export default Aggregated;
