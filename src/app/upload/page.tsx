import FileForm from "./_components/FileForm";
import {
  GetCategories,
  getPersonAccounts,
  getTxsPerYear,
} from "./actions/uploadActions";
import YearCountChart from "./_components/YearCountChart";
import WithAuth from "~/components/server/WithAuth";

const UploadPage = async () => {
  const [data, categories, personAccounts] = await Promise.all([
    getTxsPerYear(),
    GetCategories(),
    getPersonAccounts(),
  ]);

  return (
    <div className="flex size-full flex-col gap-4 overflow-auto p-4">
      {data.length !== 0 && <YearCountChart data={data} />}

      <FileForm categories={categories} people={personAccounts} />
    </div>
  );
};

export default WithAuth(UploadPage);
