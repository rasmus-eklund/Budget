import { api } from "~/trpc/server";
import SubmitButton from "../_components/SubmitButton";
import { upload } from "./actions/uploadActions";

const page = async () => {
  const counts = await api.txs.getCountsPerYear.query();
  counts.sort((a, b) => a.year - b.year);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2>Din data:</h2>
        <ul className="flex flex-col gap-2">
          {counts.map(({ count, year }) => (
            <li key={year}>
              <p>
                År {year} har {count} transaktioner.
              </p>
            </li>
          ))}
        </ul>
      </div>
      <form className="flex flex-col gap-2" action={upload}>
        <p>
          Transaktionerna du laddar upp kommer att ersätta alla transaktioner
          från året du väljer:
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="year">År</label>
          <input
            type="number"
            name="year"
            id="year"
            defaultValue={new Date().getFullYear()}
          />
        </div>
        <p>Filnamn måste vara i form av Person_Konto.csv</p>
        <input type="file" name="files" multiple accept=".csv" />
        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
};

export default page;
