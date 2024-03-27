import { type FormEvent, useState } from "react";
import SubmitButton from "~/app/_components/SubmitButton";
import type { Tx } from "~/lib/zodSchemas";
import { upload } from "../actions/uploadActions";
import type { DbTx } from "~/types";
import { encryptWithAES } from "~/lib/utils/encryption";

type Props = { txs: Tx[]; year: number };

const SubmitForm = ({ txs, year }: Props) => {
  const [pw, setPw] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const transactions: DbTx[] = [];
    for (const { datum, id, ...rest } of txs) {
      const encrypted = await encryptWithAES(JSON.stringify(rest), pw);
      const tx = {
        year,
        date: datum,
        data: encrypted.toString(),
      };
      transactions.push(tx);
    }
    await upload({ transactions, year });
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="pw">Lösenord</label>
      <input
        type="password"
        name="pw"
        id="pw"
        value={pw}
        onChange={({ target: { value } }) => setPw(value)}
      />
      <SubmitButton text="Ladda upp" />
    </form>
  );
};

export default SubmitForm;
