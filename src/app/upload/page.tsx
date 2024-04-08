import { Suspense } from "react";
import FileForm from "./_components/FileForm";
import { getTxsPerYear } from "./actions/uploadActions";
import Hide from "./_components/Hide";
import YearCountTable from "./_components/YearCountTable";

const page = async () => {
  const data = await getTxsPerYear();
  return (
    <div className="flex flex-col gap-4 p-4">
      <Hide>
        <h2>Din data:</h2>
        <Suspense fallback={<Loading />}>
          <YearCountTable data={data} />
        </Suspense>
      </Hide>
      <FileForm />
    </div>
  );
};

const Loading = () => {
  return <p>Laddar...</p>;
};
export default page;
