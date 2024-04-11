"use client";

import { type FormEvent, useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "~/components/ui/button";
import type { FromTo, Tx } from "~/lib/zodSchemas";
import {
  getFileNames,
  hasCorrectFilenames,
  readFiles,
  uploadFiles,
} from "./fileFormHelpers";
import type { Category } from "~/types";
import { usePassword } from "~/app/_components/PasswordContext";
import { applyCategories } from "~/lib/utils/categorize";
import ShowData from "~/app/transactions/_components/ShowData";
import { getFromTo } from "~/lib/utils/getYearRange";
import Link from "next/link";

type Props = { categories: Category[] };
const FileForm = ({ categories }: Props) => {
  const { password } = usePassword();
  const [files, setFiles] = useState<FileList | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState({ loading: false, percent: 0 });
  const [error, setError] = useState({
    error: false,
    message: "",
  });

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
    const y = new Set(data.map((i) => i.datum.getFullYear()));
    if (y.size !== 1) {
      setLoading({ loading: false, percent: 0 });
      setError({ error: true, message: "Ett år per uppladdning" });
    }
    setTxs(data);
    setLoading({ loading: false, percent: 0 });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading({ loading: true, percent: 0.78 });
    await uploadFiles({ password, txs });
    setFiles(null);
    setTxs([]);
    setLoading({ loading: false, percent: 0 });
  };
  useEffect(() => {
    if (!password && !error.error) {
      setError({ error: true, message: "Inget lösenord valt" });
    }
  }, [password, error.error]);
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <p>
          Transaktionerna du laddar upp kommer att ersätta alla transaktioner
          från året du väljer. Filnamn måste ha formatet
          <i> Person_Konto.csv</i>
        </p>
        <input
          onClick={() => {
            setTxs([]);
            setFiles(null);
          }}
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const test = hasCorrectFilenames(files);
              if (!test.success) {
                return setError({
                  error: true,
                  message: `Felaktigt formaterat filnamn ${test.name}`,
                });
              }
              setError({ error: false, message: "" });
              setFiles(files);
            }
          }}
          type="file"
          name="files"
          multiple
          accept=".csv"
        />
        {files && (
          <ul>
            {getFileNames(files).map((name, i) => (
              <li key={`${name}_${i}`}>{name}</li>
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
              disabled={!files || files.length === 0 || error.error}
            >
              Bearbeta
            </Button>
          )}
          <Button disabled={!txs || txs.length === 0 || !password}>
            Ladda upp
          </Button>
        </div>
      </form>
      {txs.length !== 0 ? (
        <ShowTransactions txs={txs} categories={categories} />
      ) : null}
    </div>
  );
};

const ShowTransactions = ({
  txs,
  categories,
}: {
  txs: Tx[];
  categories: Category[];
}) => {
  const fromTo = getFromTo(txs);
  const [{ from, to }, setDates] = useState<FromTo>(fromTo);
  const data: Tx[] = [];
  for (const tx of txs) {
    if (tx.datum >= from && tx.datum <= to) {
      data.push(applyCategories({ tx, categories }));
    }
  }

  return (
    <ShowData
      data={data}
      range={fromTo}
      setDates={async (dates) => {
        setDates(dates);
      }}
      defaultTab="transactions"
    />
  );
};

export default FileForm;
