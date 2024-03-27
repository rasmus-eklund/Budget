import { randomUUID } from "crypto";
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
            <th className="text-right" key={randomUUID()}>
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
            <tr key={randomUUID()}>
              <td>{capitalize(category)}</td>
              {people.map((person) => {
                const sum = sums.find((i) => i.person === person)!.sum;
                return (
                  <td
                    className={`text-right ${sum < 0 ? "text-red-600" : ""}`}
                    key={randomUUID()}
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
