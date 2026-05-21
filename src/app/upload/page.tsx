import FileForm from "./_components/FileForm";
import {
  GetCategories,
  getPersonAccounts,
  getTxsPerYear,
} from "./actions/uploadActions";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui";
import YearCountChart from "./_components/YearCountChart";
import WithAuth from "~/components/server/WithAuth";

const UploadPage = async () => {
  const [data, categories, personAccounts] = await Promise.all([
    getTxsPerYear(),
    GetCategories(),
    getPersonAccounts(),
  ]);

  return (
    <div className="flex size-full flex-col gap-4 p-4">
      {data.length !== 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Transaktioner per år</CardTitle>
          </CardHeader>
          <CardContent>
            <YearCountChart data={data} />
          </CardContent>
        </Card>
      )}
      <FileForm categories={categories} people={personAccounts} />
    </div>
  );
};

export default WithAuth(UploadPage);
