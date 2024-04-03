import { Suspense } from "react";
import FileForm from "./_components/FileForm";
import { getTxsPerYear } from "./actions/uploadActions";

const page = async () => {
  const counts = await getTxsPerYear();
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2>Din data:</h2>
        <Suspense fallback={<Loading />}>
          <ul className="flex flex-col gap-2">
            {counts.map(({ count, year }) => (
              <li key={year}>
                <p>
                  År {year} har {count} transaktioner.
                </p>
              </li>
            ))}
          </ul>
        </Suspense>
      </div>
      <FileForm />
    </div>
  );
};

const Loading = () => {
  return <p>Laddar...</p>;
};
export default page;
