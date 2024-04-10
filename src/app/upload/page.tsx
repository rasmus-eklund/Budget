import { Suspense } from "react";
import FileForm from "./_components/FileForm";
import { GetCategories, getTxsPerYear } from "./actions/uploadActions";
import Hide from "./_components/Hide";
import YearCountTable from "./_components/YearCountTable";

const page = async () => {
  const [data, categories] = await Promise.all([
    getTxsPerYear(),
    GetCategories(),
  ]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Suspense fallback={<Loading />}>
        {data.length !== 0 && (
          <Hide>
            <h2>Din data:</h2>
            <YearCountTable data={data} />
          </Hide>
        )}
      </Suspense>
      <FileForm categories={categories} />
    </div>
  );
};

const Loading = () => {
  return <p>Laddar...</p>;
};
export default page;
