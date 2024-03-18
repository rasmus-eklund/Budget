import SubmitButton from "../_components/SubmitButton";
import { upload } from "./actions/uploadActions";

const page = () => {
  return (
    <form className="flex flex-col gap-2 p-4" action={upload}>
      <p>
        Transaktionerna du laddar upp kommer att ersätta alla transaktioner från
        året du väljer:
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
      <p>Filnamn måste vara i form av {"<Person>_<Konto>.csv"}</p>
      <input type="file" name="files" multiple accept=".csv" />
      <SubmitButton />
    </form>
  );
};

export default page;
