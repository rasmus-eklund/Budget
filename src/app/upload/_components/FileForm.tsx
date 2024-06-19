"use client";

import { type FormEvent, useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "~/components/ui/button";
import type { FromTo, Tx, TxBankAccount } from "~/lib/zodSchemas";
import {
  readFiles,
  uploadFiles,
  addPersonAccount,
  findMatchingAccount,
} from "./fileFormHelpers";
import type { Category, FileData, PersonAccounts } from "~/types";
import { usePassword } from "~/components/password/PasswordContext";
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

type Props = { categories: Category[]; people: PersonAccounts };
const FileForm = ({ categories, people }: Props) => {
  const { password } = usePassword();
  const [files, setFiles] = useState<FileData[]>([]);
  const [txs, setTxs] = useState<TxBankAccount[]>([]);
  const [loading, setLoading] = useState({ loading: false, percent: 0 });
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const range = getFromTo(txs);
  const processTxs = async () => {
    if (!files) {
      return setError({ error: true, message: "Inga filer valda" });
    }
    setLoading({ loading: true, percent: 0 });
    const data = await readFiles(files, (percent) => {
      if (percent) {
        setLoading({ loading: true, percent });
      }
    });
    const y = new Set(data.map(({ datum }) => datum.getFullYear()));
    if (y.size !== 1) {
      setLoading({ loading: false, percent: 0 });
      setError({ error: true, message: "Ett år per uppladdning" });
    }
    setTxs(data);
    setLoading({ loading: false, percent: 0 });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading({ loading: true, percent: 0.5 });
    await uploadFiles({ password, txs });
    setFiles([]);
    setTxs([]);
    setLoading({ loading: false, percent: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  useEffect(() => {
    if (!password && !error.error) {
      setError({ error: true, message: "Inget lösenord valt" });
    }
  }, [password, error.error]);
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
        <p>
          Transaktionerna du laddar upp kommer att ersätta alla transaktioner
          från året du väljer.
        </p>
        {password && (
          <input
            ref={fileInputRef}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = "";
              setTxs([]);
              setFiles([]);
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
        {error.error && <p className="text-lg text-red-500">{error.message}</p>}
        {!password && (
          <Link className="underline" href={"/password?from=upload"}>
            Välj lösenord
          </Link>
        )}
        <p>Att bearbeta filer kan ta flera minuter.</p>
        <div className="flex gap-2">
          {loading.loading ? (
            <Button type="button" disabled>
              <ClipLoader size={20} className="mr-2" />
              Vänta {(loading.percent * 100).toFixed(0)} %
            </Button>
          ) : (
            <Button
              onClick={processTxs}
              type="button"
              disabled={
                files.length === 0 ||
                error.error ||
                files.some((i) => i.bankAccountId === "")
              }
            >
              Bearbeta
            </Button>
          )}
          <Button disabled={!txs || txs.length === 0 || !password}>
            Ladda upp
          </Button>
        </div>
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
  const [{ from, to }, setDates] = useState<FromTo>(range);
  const data: Tx[] = [];
  for (const tx of txs) {
    if (tx.datum >= from && tx.datum <= to) {
      data.push(applyCategory({ tx, categories }));
    }
  }

  return (
    <ShowData data={data} defaultTab="transactions">
      <DateFilter
        range={range}
        changeDates={async (dates) => setDates(dates)}
      />
    </ShowData>
  );
};

export default FileForm;
