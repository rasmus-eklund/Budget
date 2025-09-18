"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { Button } from "~/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useStore } from "~/stores/tx-store";
import Icon from "~/components/common/Icon";
import type { FromTo, TxBankAccount } from "~/lib/zodSchemas";

type Props = { categories: Category[]; people: PersonAccounts; userId: string };
const FileForm = ({ categories, people, userId }: Props) => {
  const router = useRouter();
  const password = useStore((state) => state.password);
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
    <>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <p>Transaktionerna du laddar upp kommer att ersätta året.</p>
        {password && (
          <div className="flex gap-2">
            <Button asChild variant="secondary" className="cursor-pointer">
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
                if (!files) return;
                const data: FileData[] = [];
                for (const file of files) {
                  data.push({
                    bankAccountId: findMatchingAccount(file.name, options),
                    file,
                  });
                }
                setFiles(data);
              }}
              type="file"
              name="files"
              multiple
              accept=".csv"
            />
            <Button
              onClick={processTxs}
              type="button"
              variant="outline"
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
              disabled={txs.length === 0 || !password || loading}
            >
              Ladda upp
              {loading && <Icon icon="Loader2Icon" className="animate-spin" />}
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
                  <SelectTrigger className="w-fit max-w-96">
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
      {txs.length > 0 && (
        <ShowTransactions
          txs={addPersonAccount(people, txs).map((tx) =>
            applyCategory({ tx, categories }),
          )}
        />
      )}
    </>
  );
};

const ShowTransactions = ({ txs }: { txs: Tx[] }) => {
  const { setFilterTab, setTxs, setRange } = useStore();

  useEffect(() => {
    const range = getFromTo(txs);
    if (!range) return;
    setRange(range);
    setFilterTab("transactions");
    setTxs(txs);
  }, [setFilterTab, setRange, setTxs, txs]);

  const changeDates = async ({ from, to }: FromTo) => {
    setTxs(txs.filter((i) => i.datum >= from && i.datum <= to));
  };

  return (
    <ShowData>
      <DateFilter changeDates={changeDates} />
    </ShowData>
  );
};

export default FileForm;
