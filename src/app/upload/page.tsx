import FileForm from "./_components/FileForm";
import {
  GetCategories,
  getPersonAccounts,
  getTxsPerYear,
} from "./actions/uploadActions";
import Hide from "./_components/Hide";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import YearCountChart from "./_components/YearCountChart";

const page = async () => {
  const [data, categories, personAccounts] = await Promise.all([
    getTxsPerYear(),
    GetCategories(),
    getPersonAccounts(),
  ]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {data.length !== 0 && (
        <Hide>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">
                Transaktioner per år
              </CardTitle>
            </CardHeader>
            <CardContent>
              <YearCountChart data={data} />
            </CardContent>
          </Card>
        </Hide>
      )}
      <FileForm categories={categories} people={personAccounts} />
    </div>
  );
};

export default page;
