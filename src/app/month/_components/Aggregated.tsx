import { v4 as uuid } from "uuid";
import capitalize from "~/lib/utils/capitalize";
import { toSek } from "~/lib/utils/formatData";
import { type Tx } from "~/lib/zodSchemas";
import type { Uniques } from "~/types";

type Props = { data: Tx[]; options: Uniques; loading: boolean };

const Aggregated = ({
  loading,
  data,
  options: { people, categories: cats },
}: Props) => {
  if (loading) {
    return <p>Laddar...</p>;
  }
  const categories = cats.filter((i) => i != "inom");
  const getPersonCatSum = (person: string, category: string) =>
    data
      .filter((tx) => tx.person === person && tx.budgetgrupp === category)
      .reduce((a, c) => a + c.belopp, 0);
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
          {categories.map((category) => {
            const sums = people.map((person) => ({
              person,
              sum: getPersonCatSum(person, category),
            }));
            return (
              <tr key={uuid()}>
                <td className="whitespace-nowrap p-1 font-semibold tracking-wider">
                  {capitalize(category)}
                </td>
                {people.map((person) => {
                  const sum = sums.find((i) => i.person === person)!.sum;
                  return (
                    <td
                      className={`text-right ${sum < 0 ? "text-red-600" : ""}`}
                      key={uuid()}
                    >
                      {toSek(sum)}
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

export default Aggregated;
