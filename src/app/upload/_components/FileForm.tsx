"use client";

import { type FormEvent, useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import Transactions from "~/app/month/_components/Transactions";
import { Button } from "~/components/ui/button";
import type { Tx } from "~/lib/zodSchemas";
import {
  getFileNames,
  hasCorrectFilenames,
  readFiles,
  uploadFiles,
} from "./fileFormHelpers";
import toast from "react-hot-toast";
import TransactionFilter from "~/app/month/_components/TransactionFilter";
import applyTransactionFilters from "~/lib/utils/transactionFilter";
import getUnique from "~/lib/utils/getUnique";
import type { TxFilter, TxSort } from "~/types";
import { usePassword } from "~/app/_components/PasswordContext";
import { sortOptions } from "~/lib/utils";

const FileForm = () => {
  const { password, showDialog } = usePassword();
  const [files, setFiles] = useState<FileList | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState({ loading: false, percent: 0 });
  const [error, setError] = useState({ error: false, message: "" });

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
    if (!password) {
      showDialog({ open: true });
    }
  }, [password, showDialog]);
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
        {error.error && <p className="text-lg text-red-500">{error.message}</p>}
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
              disabled={!files || files.length === 0}
            >
              Bearbeta
            </Button>
          )}
          <Button disabled={!txs || txs.length === 0 || !password}>
            Ladda upp
          </Button>
        </div>
      </form>
      {txs.length !== 0 ? <ShowTransactions txs={txs} /> : null}
    </div>
  );
};

const ShowTransactions = ({ txs }: { txs: Tx[] }) => {
  const defaults: { txFilter: TxFilter; txSort: TxSort } = {
    txFilter: {
      category: "",
      person: "",
      account: "",
      inom: false,
      search: "",
    },
    txSort: { sort: sortOptions.dateAsc },
  };
  const options = getUnique(txs);
  const [txFilter, setTxFilter] = useState<TxFilter>(defaults.txFilter);
  const [txSort, setTxSort] = useState<TxSort>(defaults.txSort);
  const applyFilters = () => {
    const filtered = applyTransactionFilters({
      data: txs,
      filters: { txFilter, txSort },
    });
    return <Transactions data={filtered} loading={false} />;
  };
  return (
    <div>
      <TransactionFilter
        options={options}
        defaults={defaults}
        filters={{ txFilter, txSort }}
        setFilters={{ setTxFilter, setTxSort }}
      />
      {applyFilters()}
    </div>
  );
};

export default FileForm;
