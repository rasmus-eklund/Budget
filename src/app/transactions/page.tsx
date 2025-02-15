import GetTxsLayer from "./_components/GetTxsLayer";
import { getDateRange } from "./dataLayer/getDateRange";
import Link from "next/link";

const TransactionPage = async () => {
  const range = await getDateRange();
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

  return <GetTxsLayer range={range} />;
};

export default TransactionPage;
