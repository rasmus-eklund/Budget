"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from "~/components/ui";
import {
  type UploadMode,
  readFiles,
  uploadFiles,
  addPersonAccount,
  findMatchingAccount,
  getMergeBaseTxs,
  getUploadedAccountIds,
  getUploadYear,
  prepareFullReplaceTxs,
  prepareMergeTxs,
} from "./fileFormHelpers";
import type { Category, FileData, Filter, PersonAccounts, Tx } from "~/types";
import {
  applyCategory,
  getErrorMessage,
  getFromTo,
  getLastMonthYear,
  capitalize,
} from "~/lib";
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
  const [uploadMode, setUploadMode] = useState<UploadMode>("replaceYear");
  const [replacedAccountIds, setReplacedAccountIds] = useState<string[]>([]);
  const [mergeSummary, setMergeSummary] = useState<{
    year: number;
    keptCount: number;
    uploadedCount: number;
    accountIds: string[];
  } | null>(null);
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

  const resetProcessedUpload = () => {
    setTxs([]);
    setFiles([]);
    setReplacedAccountIds([]);
    setMergeSummary(null);
  };

  const processTxs = async () => {
    setLoading(true);
    setError({ error: false, message: null });
    const res = await readFiles(files);
    if (!res.ok) {
      setError({ error: true, message: res.error });
      return setLoading(false);
    }

    let year: number;
    try {
      year = getUploadYear(res.data);
    } catch (error) {
      setError({ error: true, message: getErrorMessage(error) });
      return setLoading(false);
    }

    if (uploadMode === "mergeAccounts") {
      try {
        const accountIds = getUploadedAccountIds(res.data);
        const existingTxs = await getMergeBaseTxs({
          password,
          uploadedTxs: res.data,
          userId,
        });
        setTxs(prepareMergeTxs({ existingTxs, uploadedTxs: res.data }));
        setReplacedAccountIds(accountIds);
        setMergeSummary({
          accountIds,
          keptCount: existingTxs.length,
          uploadedCount: res.data.length,
          year,
        });
      } catch (error) {
        setError({ error: true, message: getErrorMessage(error) });
        return setLoading(false);
      }
    } else {
      setTxs(prepareFullReplaceTxs(res.data));
      setReplacedAccountIds([]);
      setMergeSummary(null);
    }

    setLoading(false);
    setFiles([]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({ error: false, message: null });
    try {
      await uploadFiles({
        mode: uploadMode,
        password,
        replacedAccountIds,
        txs,
        userId,
      });
    } catch (error) {
      setError({ error: true, message: getErrorMessage(error) });
      return setLoading(false);
    }
    resetProcessedUpload();
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
        <Tabs
          value={uploadMode}
          onValueChange={(value) => {
            setUploadMode(value as UploadMode);
            resetProcessedUpload();
            setError({ error: false, message: null });
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          <TabsList className="w-full md:w-fit">
            <TabsTrigger value="replaceYear">Ersätt år</TabsTrigger>
            <TabsTrigger value="mergeAccounts">Slå ihop konton</TabsTrigger>
          </TabsList>
        </Tabs>
        <p>
          {uploadMode === "replaceYear"
            ? "Transaktionerna du laddar upp ersätter hela året."
            : "Valda konton ersätts för året. Övriga konton behålls och interna transaktioner räknas om."}
        </p>
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
                resetProcessedUpload();
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
        {mergeSummary && (
          <div className="rounded-sm border bg-accent p-3 text-sm">
            <p className="font-semibold">
              Sammanslagning för {mergeSummary.year}
            </p>
            <p>
              Konton som ersätts:{" "}
              {mergeSummary.accountIds
                .map(
                  (id) =>
                    options.find((option) => option.bankAccountId === id)
                      ?.account ?? id,
                )
                .map(capitalize)
                .join(", ")}
            </p>
            <p>
              Behåller {mergeSummary.keptCount} befintliga transaktioner och
              lägger till {mergeSummary.uploadedCount} nya.
            </p>
          </div>
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
  const setTxs = useStore((state) => state.setTxs);
  const setRange = useStore((state) => state.setRange);
  const setSelectedRange = useStore((state) => state.setSelectedRange);
  const setLoading = useStore((state) => state.setLoading);

  const getData = useCallback(
    async ({ from, to }: FromTo, reset = false) => {
      setSelectedRange({ from, to });
      setTxs({
        txs: txs.filter((i) => i.datum >= from && i.datum <= to),
        options,
        reset,
        tab: reset ? "transactions" : undefined,
      });
    },
    [options, setSelectedRange, setTxs, txs],
  );

  useEffect(() => {
    const range = getFromTo(txs);
    if (!range) return;
    setRange(range);
    const dates = getLastMonthYear(range);
    void getData(dates, true);
    setLoading(false);
  }, [setRange, txs, getData, setLoading]);

  const changeDates = async ({ from, to }: FromTo) => {
    await getData({ from, to });
  };

  return <ShowData changeDates={changeDates} canMarkInternal={false} />;
};

export default FileForm;
