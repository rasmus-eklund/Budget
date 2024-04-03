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
    <table>
      <thead>
        <tr>
          <th className="text-left">Kategori</th>
          {people.map((person) => (
            <th className="text-right" key={uuid()}>
              {person}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => {
          const sums = people.map((person) => ({
            person,
            sum: getPersonCatSum(person, category),
          }));
          return (
            <tr key={uuid()}>
              <td>{capitalize(category)}</td>
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
  );
};

export default Aggregated;
