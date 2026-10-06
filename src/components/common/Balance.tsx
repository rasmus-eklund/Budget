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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui";
import { eachDayOfInterval } from "~/lib";
import { Temporal } from "@js-temporal/polyfill";
import { colors } from "~/constants";
import type { Tx } from "~/types";

type Props = {
  data: Tx[];
};

const Balance = (props: Props) => {
  const range = getRange(props.data);
  const persons = getPersonAccounts(props.data);
  const { data, personAccounts } = fillMissingDates(props.data, range, persons);
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Saldo över tid</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} minWidth={"100%"}>
          <LineChart data={data}>
            <Tooltip itemSorter={(item) => (item.value as number) * -1} />
            <CartesianGrid />
            <YAxis type="number" domain={["dataMin - 10", "dataMax + 100"]} />
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
            <Legend formatter={(item) => <p className="capitalize">{item}</p>} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const formatter = (date: Temporal.PlainDate) =>
  `${String(date.year).slice(-2)}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

const getRange = (txs: Tx[]) => {
  if (txs.length === 0) {
    return [];
  }
  let startDate = txs[0]!.datum;
  let endDate = txs[0]!.datum;
  for (const tx of txs) {
    if (Temporal.PlainDate.compare(tx.datum, startDate) < 0) {
      startDate = tx.datum;
    }
    if (Temporal.PlainDate.compare(tx.datum, endDate) > 0) {
      endDate = tx.datum;
    }
  }
  return eachDayOfInterval({ from: startDate, to: endDate });
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
  allDates: Temporal.PlainDate[],
  persons: Record<string, string[]>,
) => {
  const personAccountsSet = new Set<string>();
  for (const person in persons) {
    for (const account of persons[person]!) {
      personAccountsSet.add(`${person}_${account}`);
    }
  }

  const accountTxMap: Record<string, Record<string, number>> = {};
  const accountFirstTx: Record<string, { date: Temporal.PlainDate; saldo: number } | undefined> =
    {};

  for (const acc of personAccountsSet) {
    accountTxMap[acc] = {};
    accountFirstTx[acc] = undefined;
  }

  const sortedTxs = [...txs].sort((a, b) => Temporal.PlainDate.compare(a.datum, b.datum));

  for (const tx of sortedTxs) {
    const key = `${tx.person}_${tx.konto}`;
    if (!accountTxMap[key]) {
      continue;
    }
    const dateKey = formatter(tx.datum);
    accountTxMap[key][dateKey] = tx.saldo;
    if (!accountFirstTx[key]) {
      accountFirstTx[key] = { date: tx.datum, saldo: tx.saldo };
    }
  }

  const filledTransactions: Record<string, string | number>[] = [];
  const currentBalances: Record<string, number> = {};

  const sortedDates = [...allDates].sort((a, b) => Temporal.PlainDate.compare(a, b));

  for (const d of sortedDates) {
    const dateKey = formatter(d);
    const dayData: Record<string, string | number> = { date: dateKey };

    for (const account of personAccountsSet) {
      if (accountTxMap[account]![dateKey] !== undefined) {
        currentBalances[account] = accountTxMap[account]![dateKey];
      }
      if (currentBalances[account] === undefined) {
        if (
          accountFirstTx[account] &&
          Temporal.PlainDate.compare(d, accountFirstTx[account].date) < 0
        ) {
          currentBalances[account] = accountFirstTx[account].saldo;
        } else {
          currentBalances[account] = 0;
        }
      }
      dayData[account] = currentBalances[account];
    }
    filledTransactions.push(dayData);
  }

  return {
    data: filledTransactions,
    personAccounts: Array.from(personAccountsSet),
  };
};

export default Balance;
