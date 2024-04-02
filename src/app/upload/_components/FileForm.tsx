"use client";

import { type FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import Transactions from "~/app/month/_components/Transactions";
import { Button } from "~/components/ui/button";
import { markInternal } from "~/lib/utils/findInternal";
import parseTxs from "~/lib/utils/parseTxs";
import type { Tx } from "~/lib/zodSchemas";
import SubmitForm from "./SubmitForm";
import { getFileNames, hasCorrectFilenames } from "./fileFormHelpers";
import toast from "react-hot-toast";

const readFiles = async (
  files: FileList,
  updatePercent: (percent: number) => void,
) => {
  const data: Tx[] = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const [person, konto_end] = file.name.split("_") as [string, string];
    const konto = konto_end.replace(".csv", "").replace("Ã¤", "ä");
    const txs = await parseTxs(buffer, person, konto);
    data.push(...txs);
  }
  const internal = markInternal(data, updatePercent);
  return internal;
};

const FileForm = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [txs, setTxs] = useState<Tx[] | null>(null);
  const [loading, setLoading] = useState({ loading: false, percent: 0 });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) {
      throw new Error("no files");
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
      throw new Error("Ett år per uppladdning");
    }
    setTxs(data);
    setLoading({ loading: false, percent: 0 });
  };
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
            setTxs(null);
            setFiles(null);
          }}
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const test = hasCorrectFilenames(files);
              if (!test.success) {
                return toast.error(`Felaktigt formaterat filnamn ${test.name}`);
              }
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
        <div>
          <p>Att bearbeta filer kan ta flera minuter.</p>
          {loading.loading ? (
            <Button disabled>
              <ClipLoader size={20} className="mr-2" />
              Vänta {(loading.percent * 100).toFixed(0)} %
            </Button>
          ) : (
            <Button disabled={!files || files.length === 0}>Bearbeta</Button>
          )}
        </div>
      </form>
      {txs ? (
        <div>
          <SubmitForm
            txs={txs}
            onSubmit={() => {
              setFiles(null);
              setTxs(null);
            }}
          />
          <Transactions data={txs} />
        </div>
      ) : null}
    </div>
  );
};

export default FileForm;
