import DateFilter from "./_components/DateFilter";
import Tabs from "~/components/common/Tabs";
import Aggregated from "./_components/Aggregated";
import parseSearch from "~/lib/utils/parseUrlDates";
import Transactions from "./_components/Transactions";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { dbTxSchema, type Tx } from "~/lib/zodSchemas";
import type { DbTx } from "~/types";
import { decryptWithAES } from "~/lib/utils/encryption";
import getTxByDates from "./dataLayer/getData";

const decryptTxs = async (encryptedData: DbTx[]): Promise<Tx[]> => {
  const decryptedData: Tx[] = [];
  for (const { data, date } of encryptedData) {
    const arr = new Uint8Array(data.split(",").map(Number));
    try {
      const decrypted = await decryptWithAES(arr, "test");
      const parsed = dbTxSchema.safeParse(JSON.parse(decrypted));
      if (!parsed.success) {
        throw new Error("Corrupted data");
      }
      const tx: Tx = {datum: date, id}
      decryptedData.push({ ...parsed.data, ...rest });
    } catch (error) {
      throw new Error("Wrong password");
    }
  }
  return decryptedData;
};

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};
const Month = async ({ searchParams }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const dates = parseSearch({ searchParams });
  const encryptedData = await getTxByDates(dates);
  await decryptTxs(encryptedData);
  const data = [] as Tx[]; //await api.txs.getTxByDates.query(dates);
  return (
    <section className="flex h-full flex-col gap-5 pt-2">
      <DateFilter path="month" />
      <Tabs
        tabs={[
          {
            name: "Budget",
            tab: <Aggregated data={data} />,
          },
          {
            name: "Transaktioner",
            tab: <Transactions data={data} />,
          },
        ]}
      />
    </section>
  );
};

export default Month;
