import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import GetTxsLayer from "./_components/GetTxsLayer";
import { getDateRange } from "./dataLayer/getDateRange";
import Link from "next/link";
import { Suspense } from "react";

const TransactionPage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
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

  return (
    <Suspense fallback={<p>Laddar...</p>}>
      <GetTxsLayer range={range} />
    </Suspense>
  );
};

export default TransactionPage;
