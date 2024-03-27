"use client";

import { type FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import Transactions from "~/app/month/_components/Transactions";
import { Button } from "~/components/ui/button";
import { markInternal } from "~/lib/utils/findInternal";
import parseTxs from "~/lib/utils/parseTxs";
import type { Tx } from "~/lib/zodSchemas";
import { upload } from "../actions/uploadActions";
import SubmitButton from "~/app/_components/SubmitButton";
import SubmitForm from "./SubmitForm";

const readFiles = async (files: FileList) => {
  const data: Tx[] = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const [person, konto_end] = file.name.split("_") as [string, string];
    const konto = konto_end.replace(".csv", "").replace("Ã¤", "ä");
    const txs = await parseTxs(buffer, person, konto);
    data.push(...txs);
  }
  const internal = markInternal(data);
  return internal;
};

const FileForm = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [files, setFiles] = useState<FileList | undefined>();
  const [txs, setTxs] = useState<Tx[] | undefined>();
  const [loading, setLoading] = useState(false);
  const getFileNames = (files: FileList | undefined) => {
    if (!files) {
      return [];
    }
    const names: string[] = [];
    for (const file of files) {
      names.push(file.name);
    }
    return names;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files) {
      throw new Error("no files");
    }
    setLoading(true);
    const data = await readFiles(files);
    const y = new Set(data.map((i) => i.datum.getFullYear()));
    if (y.size !== 1) {
      setLoading(false);
    }
    setYear([...y][0]!);
    setLoading(false);
    setTxs(data);
  };
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <p>
          Transaktionerna du laddar upp kommer att ersätta alla transaktioner
          från året du väljer. Filnamn måste vara i form av
          <i> Person_Konto.csv</i>
        </p>
        <input
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              setFiles(files);
            }
          }}
          type="file"
          name="files"
          multiple
          accept=".csv"
        />
        <ul>
          {getFileNames(files).map((name, i) => (
            <li key={`${name}_${i}`}>{name}</li>
          ))}
        </ul>
        <div>
          <p>Att bearbeta filer kan ta flera minuter.</p>
          {loading ? (
            <Button disabled>
              <ClipLoader size={20} className="mr-2" />
              Vänta
            </Button>
          ) : (
            <Button>Bearbeta</Button>
          )}
        </div>
      </form>
      {txs ? (
        <div>
          <SubmitForm txs={txs} year={year} />
          <Transactions data={txs} />
        </div>
      ) : null}
    </div>
  );
};

export default FileForm;