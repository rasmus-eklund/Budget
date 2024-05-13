"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import capitalize from "~/lib/utils/capitalize";
import { type Tx } from "~/lib/zodSchemas";
import { eachDayOfInterval, format } from "date-fns";
import { colors } from "~/lib/constants/colors";

type Props = {
  data: Tx[];
};

const Balance = (props: Props) => {
  const range = getRange(props.data);
  const persons = getPersonAccounts(props.data);
  const { data, personAccounts } = fillMissingDates(props.data, range, persons);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo över tid</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} minWidth={"100%"}>
          <LineChart data={data}>
            <Tooltip />
            <CartesianGrid />
            <YAxis />
            <XAxis dataKey={"date"} />
            {personAccounts.map((pa, index) => (
              <Line
                dot={false}
                key={pa}
                stroke={colors[index]}
                type="monotone"
                dataKey={pa}
                name={pa}
              />
            ))}
            <Legend formatter={(item) => capitalize(item as string)} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const formatter = (date: Date) => format(date, "yy-MM-dd");

const getRange = (txs: Tx[]) => {
  const dates = txs.map((tx) => Number(tx.datum));
  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));
  return eachDayOfInterval({ start: startDate, end: endDate });
};

const getPersonAccounts = (txs: Tx[]) => {
  const personAccounts: Record<string, Set<string>> = {};
  for (const tx of txs) {
    if (personAccounts[tx.person]) {
      personAccounts[tx.person]!.add(tx.konto);
    } else {
      personAccounts[tx.person] = new Set([tx.konto]);
    }
  }
  const out: Record<string, string[]> = {};
  for (const person in personAccounts) {
    out[person] = Array.from(personAccounts[person]!);
  }
  return out;
};

const fillMissingDates = (
  txs: Tx[],
  allDates: Date[],
  persons: Record<string, string[]>,
) => {
  const filledTransactions: Record<string, string | number>[] = [];
  const personAccountsSet = new Set<string>();
  for (const d of allDates) {
    const date = formatter(d);
    const data: Record<string, number | string> = { date };
    for (const person in persons) {
      for (const account of persons[person]!) {
        const key = `${person}_${account}`;
        personAccountsSet.add(key);
        const tx = txs
          .filter(
            (tx) =>
              tx.person === person &&
              tx.konto === account &&
              formatter(tx.datum) === date,
          )
          .at(-1);
        if (tx) {
          data[key] = tx.saldo;
        } else {
          const lastTx = filledTransactions.at(-1);
          if (lastTx) {
            data[key] = lastTx[key] as number;
          } else {
            data[key] = 0;
          }
        }
      }
    }
    filledTransactions.push(data);
  }
  return {
    data: filledTransactions,
    personAccounts: Array.from(personAccountsSet),
  };
};

export default Balance;
