import { v4 as uuid } from "uuid";
import capitalize from "~/lib/utils/capitalize";
import { toSek } from "~/lib/utils/formatData";
import { type Tx } from "~/lib/zodSchemas";

type Props = { data: Tx[] };

const Aggregated = ({ data }: Props) => {
  const people = [...new Set(data.map(({ person }) => person))];
  const cats = [...new Set(data.map(({ budgetgrupp }) => budgetgrupp))].filter(
    (i) => i != "inom",
  );
  const categories = [
    ...cats.filter((x) => x === "inkomst"),
    ...cats.filter((x) => x !== "inkomst" && x !== "övrigt"),
    ...cats.filter((x) => x === "övrigt"),
  ];
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
