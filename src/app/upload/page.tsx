import FileForm from "./_components/FileForm";
import {
  GetCategories,
  getPersonAccounts,
  getTxsPerYear,
} from "./actions/uploadActions";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import YearCountChart from "./_components/YearCountChart";
import { WithAuth, type WithAuthProps } from "~/components/common/withAuth";

const UploadPage = async ({ userId }: WithAuthProps) => {
  const [data, categories, personAccounts] = await Promise.all([
    getTxsPerYear(userId),
    GetCategories(userId),
    getPersonAccounts(userId),
  ]);

  return (
    <div className="flex flex-col gap-4 p-4 size-full">
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
      <FileForm
        categories={categories}
        people={personAccounts}
        userId={userId}
      />
    </div>
  );
};

export default WithAuth(UploadPage);
