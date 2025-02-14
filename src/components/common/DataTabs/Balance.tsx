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
import dayjs from "dayjs";
import { colors } from "~/lib/constants/colors";
import type { Tx } from "~/types";
import { eachDayOfInterval } from "~/lib/utils/dateCalculations";

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
            <Tooltip itemSorter={(item) => (item.value as number) * -1} />
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

const formatter = (date: Date) => dayjs(date).format("YY-MM-DD");

const getRange = (txs: Tx[]) => {
  const dates = txs.map((tx) => Number(tx.datum));
  const minD = new Date(Math.min(...dates));
  const maxD = new Date(Math.max(...dates));
  const startDate = new Date(
    Date.UTC(minD.getUTCFullYear(), minD.getUTCMonth(), minD.getUTCDate()),
  );
  const endDate = new Date(
    Date.UTC(maxD.getUTCFullYear(), maxD.getUTCMonth(), maxD.getUTCDate()),
  );
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
  const personAccountsSet = new Set<string>();
  for (const person in persons) {
    for (const account of persons[person]!) {
      personAccountsSet.add(`${person}_${account}`);
    }
  }

  const accountTxMap: Record<string, Record<string, number>> = {};
  const accountFirstTx: Record<
    string,
    { date: Date; saldo: number } | undefined
  > = {};

  for (const acc of personAccountsSet) {
    accountTxMap[acc] = {};
    accountFirstTx[acc] = undefined;
  }

  txs.sort((a, b) => a.datum.getTime() - b.datum.getTime());

  for (const tx of txs) {
    const key = `${tx.person}_${tx.konto}`;
    if (!accountTxMap[key]) continue;
    const dateKey = formatter(tx.datum);
    accountTxMap[key][dateKey] = tx.saldo;
    if (!accountFirstTx[key]) {
      accountFirstTx[key] = { date: tx.datum, saldo: tx.saldo };
    }
  }

  const filledTransactions: Record<string, string | number>[] = [];
  const currentBalances: Record<string, number> = {};

  const sortedDates = [...allDates].sort((a, b) => a.getTime() - b.getTime());

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
          d.getTime() < accountFirstTx[account].date.getTime()
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
