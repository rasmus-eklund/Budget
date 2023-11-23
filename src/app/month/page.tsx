"use client";
import { api } from "~/trpc/react";
import { toDate, toSek } from "../utils/formatData";
import MonthForm from "./components/MonthForm";
import { useState } from "react";
import { type tDatesSchema } from "~/zodSchemas";

const Month = () => {
  const [dates, setDates] = useState<tDatesSchema>({
    from: new Date("2023-01-01"),
    to: new Date("2023-01-31"),
  });
  return (
    <section className="h-full">
      <MonthForm onSubmit={(d) => setDates(d)} />
      <Results dates={dates} />
    </section>
  );
};

type ResultsProps = { dates: { from: Date; to: Date } };
const Results = ({ dates }: ResultsProps) => {
  const { data, isSuccess, isLoading } = api.txs.getTxByDates.useQuery(dates);
  return (
    <ul className="h-full overflow-y-auto">
      {isSuccess &&
        data.map(({ datum, belopp, id }) => (
          <li className="grid grid-cols-2" key={id}>
            <p>{toDate(datum)}</p>
            <p className={`text-right font-mono ${belopp < 0 && "text-red"}`}>
              {toSek(belopp)}
            </p>
          </li>
        ))}
      {isLoading && <p>Laddar...</p>}
    </ul>
  );
};

export default Month;
