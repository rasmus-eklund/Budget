import { WithAuth, type WithAuthProps } from "~/components/common/withAuth";
import GetTxsLayer from "./_components/GetTxsLayer";
import { getDateRange } from "./dataLayer/getDateRange";
import Link from "next/link";

const TransactionPage = async ({ userId }: WithAuthProps) => {
  const range = await getDateRange(userId);
  if (!range) {
    return (
      <p className="p-2">
        Du har ingen data att visa än. Klicka{" "}
        <span>
          <Link href={"/upload"} className="underline">
            här
          </Link>
        </span>{" "}
        för att ladda upp data
      </p>
    );
  }

  return <GetTxsLayer range={range} userId={userId} />;
};

export default WithAuth(TransactionPage);
