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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { colors } from "~/lib/constants/colors";
import capitalize from "~/lib/utils/capitalize";
import type { Tx, Uniques } from "~/types";

type Props = {
  data: Tx[];
  options: Uniques;
};

const CategoryBars = ({ data, options }: Props) => {
  const sums: Record<string, string | number>[] = [];
  const cats = options.categories.filter(
    (c) => !(c === "inkomst" || c === "inom"),
  );
  for (const cat of cats) {
    const record: Record<string, string | number> = {};
    for (const person of options.people) {
      record.cat = cat;
      const sum = data
        .filter((tx) => tx.budgetgrupp === cat && tx.person === person)
        .reduce((acc, cur) => (cur.belopp < 0 ? acc + cur.belopp : 0), 0);
      if (sum !== 0) {
        record[person] = Number(Math.abs(sum).toFixed(2));
      }
    }
    sums.push(record);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Utgift per kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} minWidth={"100%"}>
          <BarChart data={sums} barCategoryGap={"20%"}>
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
            <Legend formatter={(item) => capitalize(item as string)} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryBars;
