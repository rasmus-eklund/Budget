import { randomUUID } from "crypto";
import capitalize from "~/utils/capitalize";
import { toSek } from "~/utils/formatData";
import { type Tx } from "~/zodSchemas";

type Props = { data: Tx[] };

const Aggregated = ({ data }: Props) => {
  const people = [...new Set(data.map(({ person }) => person))];
  const categories = [
    ...new Set(data.map(({ budgetgrupp }) => budgetgrupp)),
  ].filter((i) => i != "inom");
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
                    className={`text-right ${sum < 0 ? "text-red" : ""}`}
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
