"use client";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "~/components/common";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui";

type Props = { data: { year: number; count: number }[] };

const YearCountChart = ({ data }: Props) => {
  const [open, setOpen] = useState(true);
  return (
    <Card className="py-0">
      <CardHeader className="gap-0 p-0">
        <Button
          onClick={() => setOpen((p) => !p)}
          variant="ghost"
          className="flex items-center justify-between gap-2"
        >
          <CardTitle className="text-primary">Transaktioner per år</CardTitle>
          <Icon icon={open ? "ChevronUp" : "ChevronDown"} />
        </Button>
      </CardHeader>
      {open && (
        <CardContent>
          <ResponsiveContainer height={200} minWidth={"100%"}>
            <BarChart data={data}>
              <CartesianGrid />
              <Tooltip cursor={false} />
              <XAxis dataKey={"year"} />
              <YAxis dataKey={"count"} />
              <Bar dataKey={"count"} name={"Antal"} fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      )}
    </Card>
  );
};

export default YearCountChart;
