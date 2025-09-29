"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui";
import {
  readFiles,
  uploadFiles,
  addPersonAccount,
  findMatchingAccount,
} from "./fileFormHelpers";
import type { Category, FileData, Filter, PersonAccounts, Tx } from "~/types";
import { applyCategory, getFromTo, getLastMonthYear, capitalize } from "~/lib";
import { ShowData, Icon } from "~/components/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "~/stores/tx-store";
import type { FromTo, TxBankAccount } from "~/lib/zodSchemas";
import { configs } from "~/constants";

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
                    config: configs[0]!,
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
            {files.map(({ file, bankAccountId, config }, i) => (
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
                <Select
                  value={config.name}
                  onValueChange={(value) => {
                    setFiles((p) => {
                      const newFiles = [...p];
                      newFiles[i] = {
                        ...newFiles[i]!,
                        config: configs.find(
                          (i) => i.name === (value as keyof typeof configs),
                        )!,
                      };
                      return newFiles;
                    });
                  }}
                >
                  <SelectTrigger className="w-fit max-w-96">
                    <SelectValue placeholder="Välj konto" />
                  </SelectTrigger>
                  <SelectContent>
                    {configs.map((option) => (
                      <SelectItem key={option.name} value={option.name}>
                        {capitalize(option.name)}
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
          options={{
            account: Object.fromEntries(
              people.flatMap((p) => p.bankAccounts.map((a) => [a.name, true])),
            ),
            person: Object.fromEntries(people.map((i) => [i.name, true])),
            category: {
              ...Object.fromEntries(categories.map((i) => [i.name, true])),
              inom: false,
              övrigt: true,
              inkomst: true,
            },
            search: "",
          }}
        />
      )}
    </>
  );
};

const ShowTransactions = ({ txs, options }: { txs: Tx[]; options: Filter }) => {
  const { setTxs, setRange, setLoading } = useStore();
  useEffect(() => {
    const range = getFromTo(txs);
    if (!range) return;
    const { from, to } = getLastMonthYear(range);
    setRange(range);
    setTxs({
      txs: txs.filter((i) => i.datum >= from && i.datum <= to),
      options,
      reset: true,
      tab: "transactions",
    });
    setLoading(false);
  }, [setRange, setTxs, txs, options]);

  const changeDates = async ({ from, to }: FromTo) => {
    setTxs({
      txs: txs.filter((i) => i.datum >= from && i.datum <= to),
      options,
    });
  };

  return <ShowData changeDates={changeDates} />;
};

export default FileForm;
