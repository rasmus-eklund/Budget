import type z from "zod";
import type { csvSchema } from "~/lib/zodSchemas";

type CsvSchema = z.infer<typeof csvSchema>;
type ImportErrorsProps = {
  error: z.ZodError<CsvSchema>;
  file: string;
};
const ImportErrors = ({ error, file }: ImportErrorsProps) => {
  if (error.issues.length === 0) {
    return null;
  }
  const format = error.format();
  const errors = Object.entries(format).map(([key, error]) => {
    if (key === "bankAccountId") {
      return { field: key, message: "" };
    }
    if (typeof error === "string") {
      return { field: key, message: error };
    }
    if (Array.isArray(error)) {
      return { field: "Fel", message: error.join(", ") };
    }
    const { _errors } = error;
    return { field: key, message: _errors.join(", ") };
  });
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-red-500 p-4">
      <p>Fel i fil: {file}</p>
      {errors
        .filter((i) => i.message !== "")
        .map(({ field, message }) => (
          <p key={field}>
            {field}: {message}
          </p>
        ))}
    </div>
  );
};

export default ImportErrors;
