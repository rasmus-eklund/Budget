"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = { data: { year: number; count: number }[] };

const YearCountChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer height={200} minWidth={"100%"}>
      <BarChart data={data}>
        <CartesianGrid />
        <Tooltip cursor={false} />
        <XAxis dataKey={"year"} />
        <YAxis dataKey={"count"} />
        <Bar dataKey={"count"} name={"Antal"} fill="#dc2626" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default YearCountChart;
