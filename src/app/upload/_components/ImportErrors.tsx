import type z from "zod";
import { capitalize } from "~/lib";
import type { CsvSchema } from "~/lib/zodSchemas";

type ImportErrorsProps = {
  error: z.ZodError<CsvSchema>;
  file: string;
  skip: number;
};
const ImportErrors = ({ error, file, skip }: ImportErrorsProps) => {
  if (error.issues.length === 0) {
    return null;
  }
  const items = new Map<
    string,
    { index: number; field: string; message: string }
  >();
  for (const {
    path: [index, field],
    message,
  } of error.issues) {
    const key = `${index}-${field}-${message}`;
    if (!items.has(key)) {
      items.set(key, { index, field, message } as {
        index: number;
        field: string;
        message: string;
      });
    }
  }
  const errors = Array.from(items.values());
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-primary p-4">
      <p>Fel i fil: {file}</p>
      <ul className="flex flex-col gap-1">
        {Array.from(errors)
          .filter((i) => i.message !== "")
          .map(({ index, field, message }) => (
            <li key={`${file}-${index}-${field}-${message}`}>
              Rad {index + 1 + skip} - {capitalize(field)}: {message}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ImportErrors;
