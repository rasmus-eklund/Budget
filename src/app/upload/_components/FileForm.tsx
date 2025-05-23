"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { Button } from "~/components/ui/button";
import type { FromTo, TxBankAccount } from "~/lib/zodSchemas";
import {
  readFiles,
  uploadFiles,
  addPersonAccount,
  findMatchingAccount,
} from "./fileFormHelpers";
import type { Category, FileData, PersonAccounts, Tx } from "~/types";
import { applyCategory } from "~/lib/utils/categorize";
import ShowData from "~/components/common/ShowData";
import { getFromTo } from "~/lib/utils/dateCalculations";
import Link from "next/link";
import DateFilter from "~/components/common/DateFilters/DateFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import capitalize from "~/lib/utils/capitalize";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { usePasswordStore } from "~/stores/password-store";
import { useTxFilterStore } from "~/stores/tx-filter-store";

type Props = { categories: Category[]; people: PersonAccounts; userId: string };
const FileForm = ({ categories, people, userId }: Props) => {
  const router = useRouter();
  const { password } = usePasswordStore();
  const [files, setFiles] = useState<FileData[]>([]);
  const [txs, setTxs] = useState<TxBankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ error: boolean; message: ReactNode }>({
    error: false,
    message: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (password === "") {
      router.push("/password?from=upload");
    }
  }, [password, router]);

  const range = getFromTo(txs);
  const processTxs = async () => {
    setLoading(true);
    const res = await readFiles(files);
    if (!res.ok) {
      setError({ error: true, message: res.error });
      return setLoading(false);
    }
    const y = new Set(res.data.map(({ datum }) => datum.getFullYear()));
    if (y.size !== 1) {
      setError({ error: true, message: "Ett år per uppladdning" });
      return setLoading(false);
    }
    setTxs(res.data);
    setLoading(false);
    setFiles([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await uploadFiles({ password, txs, userId });
    setFiles([]);
    setTxs([]);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const options = people.flatMap((p) =>
    p.bankAccounts.map((a) => ({
      person: p.name,
      account: a.name,
      bankAccountId: a.id,
    })),
  );
  if (people.length === 0) {
    return (
      <p>
        Klicka{" "}
        <span>
          <Link className="underline" href={"/people"}>
            här
          </Link>
        </span>{" "}
        för att lägga till personer och konton.
      </p>
    );
  }
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <p>Transaktionerna du laddar upp kommer att ersätta året.</p>
        {password && (
          <div className="flex gap-2">
            <Button asChild className="cursor-pointer">
              <label className="select-none" htmlFor="file-upload">
                Välj filer
              </label>
            </Button>
            <input
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = "";
                setTxs([]);
                setFiles([]);
                setError({ error: false, message: "" });
              }}
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  const data: FileData[] = [];
                  for (const file of files) {
                    data.push({
                      bankAccountId: findMatchingAccount(file.name, options),
                      file,
                    });
                  }
                  setFiles(data);
                }
              }}
              type="file"
              name="files"
              multiple
              accept=".csv"
            />
            <Button
              onClick={processTxs}
              type="button"
              disabled={
                files.length === 0 ||
                error.error ||
                files.some((i) => i.bankAccountId === "")
              }
            >
              {loading ? "Laddar..." : "Bearbeta"}
            </Button>
            <Button
              className="flex items-center gap-2"
              disabled={!txs || txs.length === 0 || !password}
            >
              <p>Ladda upp</p>
              {loading && <ClipLoader size={20} />}
            </Button>
          </div>
        )}
        {files && (
          <ul className="flex flex-col gap-2">
            {files.map(({ file, bankAccountId }, i) => (
              <li className="flex items-center gap-2" key={`${file.name}_${i}`}>
                <h2>{file.name}</h2>
                <Select
                  value={bankAccountId}
                  onValueChange={(value) => {
                    setFiles((p) => {
                      const newFiles = [...p];
                      newFiles[i] = { ...newFiles[i]!, bankAccountId: value };
                      return newFiles;
                    });
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Välj konto" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={option.bankAccountId}
                        value={option.bankAccountId}
                      >
                        {capitalize(option.person)} -{" "}
                        {capitalize(option.account)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        )}
        {error.error && <>{error.message}</>}
      </form>
      {txs.length !== 0 && range ? (
        <ShowTransactions
          txs={addPersonAccount(people, txs)}
          categories={categories}
          range={range}
        />
      ) : null}
    </div>
  );
};

const ShowTransactions = ({
  txs,
  categories,
  range,
}: {
  txs: Tx[];
  categories: Category[];
  range: FromTo;
}) => {
  const { setTab } = useTxFilterStore();
  const [{ from, to }, setDates] = useState<FromTo>(range);
  const data: Tx[] = [];
  for (const tx of txs) {
    if (tx.datum >= from && tx.datum <= to) {
      data.push(applyCategory({ tx, categories }));
    }
  }

  useEffect(() => {
    setTab("transactions");
  }, [setTab]);

  return (
    <ShowData data={data}>
      <DateFilter
        range={range}
        changeDates={async (dates) => setDates(dates)}
      />
    </ShowData>
  );
};

export default FileForm;
