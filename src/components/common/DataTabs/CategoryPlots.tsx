"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useMediaQuery } from "~/hooks/use-media-query";
import { colors } from "~/lib/constants/colors";
import capitalize from "~/lib/utils/capitalize";
import { toSek } from "~/lib/utils/formatData";
import type { Tx, Uniques } from "~/types";

type Props = {
  data: Tx[];
  options: Uniques;
};

type Sum = Record<string, string | number>;
type Data = { name: string; value: number };
type Persons = Record<string, Data[]>;

const CategoryPlots = ({ data, options }: Props) => {
  const sums: Sum[] = [];
  const persons: Persons = {};
  const cats = options.categories.filter(
    (c) => !(c === "inkomst" || c === "inom"),
  );
  for (const cat of cats) {
    const record: Record<string, string | number> = {};
    for (const person of options.people) {
      if (!persons[person]) persons[person] = [];
      record.cat = cat;
      const sum = data
        .filter((tx) => tx.budgetgrupp === cat && tx.person === person)
        .reduce((acc, cur) => (cur.belopp < 0 ? acc + cur.belopp : 0), 0);
      if (sum !== 0) {
        record[person] = Number(Math.abs(sum).toFixed(2));
        persons[person].push({
          name: cat,
          value: Number(Math.abs(sum).toFixed(2)),
        });
      }
    }
    sums.push(record);
  }
  return (
    <div className="flex flex-col gap-2">
      <CategoryBars sums={sums} options={options} />
      {Object.keys(persons).map((person) => (
        <CategoryPies
          data={persons[person]!}
          name={capitalize(person)}
          key={person}
        />
      ))}
    </div>
  );
};

const CategoryBars = ({ sums, options }: { sums: Sum[]; options: Uniques }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Utgift per kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300}>
          <BarChart
            data={sums}
            barCategoryGap={isDesktop ? "5%" : "1%"}
            barGap={"1%"}
          >
            <Tooltip cursor={false} />
            <CartesianGrid />
            <YAxis />
            <XAxis
              dataKey={"cat"}
              tickFormatter={(item) => capitalize(item as string)}
            />
            {options.people.map((person, i) => (
              <Bar key={person} dataKey={person} fill={colors[i]} />
            ))}
            <Legend
              formatter={(item) => (
                <p className="text-sm md:text-base">
                  {capitalize(item as string)}
                </p>
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CategoryPies = ({ data, name }: { name: string; data: Data[] }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });
  if (data.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={isDesktop ? 300 : 150} width={"100%"}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={isDesktop ? 60 : 30}
              outerRadius={isDesktop ? 80 : 40}
              paddingAngle={5}
              label={PieLabel}
            >
              {data.map(({ name }, i) => (
                <Cell
                  key={`cell-${name}`}
                  fill={colors[i]}
                  fontSize={isDesktop ? 20 : 10}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const PieLabel = ({ name, value }: { name: string; value: number }) =>
  `${name}: ${toSek(value)}`;

export default CategoryPlots;
