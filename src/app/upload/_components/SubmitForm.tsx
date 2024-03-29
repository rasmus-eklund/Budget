import { passwordsSchema, type Tx } from "~/lib/zodSchemas";
import { upload } from "../actions/uploadActions";
import type { DbTx } from "~/types";
import { encryptWithAES } from "~/lib/utils/encryption";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ErrorMessage } from "@hookform/error-message";
import { Button } from "~/components/ui/button";
import { ClipLoader } from "react-spinners";

type Props = { txs: Tx[]; onSubmit: () => void };
type FormInputs = z.infer<typeof passwordsSchema>;

const SubmitForm = ({ txs, onSubmit }: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormInputs>({
    mode: "all",
    resolver: zodResolver(passwordsSchema),
  });
  const submitting = async ({ password }: FormInputs) => {
    const years = new Set<number>();
    const transactions: DbTx[] = [];
    for (const { datum, id, ...rest } of txs) {
      const encrypted = await encryptWithAES(JSON.stringify(rest), password);
      const year = datum.getFullYear();
      const tx = {
        year,
        date: datum,
        data: encrypted.toString(),
        id: "1",
      };
      transactions.push(tx);
      years.add(year);
    }
    if (years.size !== 1) {
      throw new Error("Ett år per uppladdning");
    }
    const [year] = Array.from(years) as [number];
    await upload({ transactions, year });
    reset();
    onSubmit();
  };
  return (
    <form
      className="flex flex-col gap-2 p-4"
      onSubmit={handleSubmit(submitting)}
    >
      <div className="flex gap-2">
        <label htmlFor="pw">Lösenord</label>
        <input
          className="border-b border-b-red-500"
          type="password"
          {...register("password")}
        />
        <ErrorMessage name="password" errors={errors} />
      </div>
      <div className="flex gap-2">
        <label htmlFor="pw">Repetera lösenord</label>
        <input
          className="border-b border-b-red-500"
          type="password"
          {...register("confirm")}
        />
        <ErrorMessage name="confirm" errors={errors} />
      </div>
      {isSubmitting ? (
        <Button disabled>
          <ClipLoader size={20} className="mr-2" />
          Vänta
        </Button>
      ) : (
        <Button disabled={!isValid}>Ladda upp</Button>
      )}
    </form>
  );
};

export default SubmitForm;
