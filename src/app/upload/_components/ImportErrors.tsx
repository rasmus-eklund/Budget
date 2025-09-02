import type z from "zod";
import capitalize from "~/lib/utils/capitalize";
import type { CsvSchema } from "~/lib/zodSchemas";

type ImportErrorsProps = {
  error: z.ZodError<CsvSchema>;
  file: string;
};
const ImportErrors = ({ error, file }: ImportErrorsProps) => {
  if (error.issues.length === 0) {
    return null;
  }
  const items = new Map<string, { field: string; message: string }>();
  for (const {
    path: [, field],
    message,
  } of error.issues) {
    const key = `${field}-${message}`;
    if (!items.has(key)) {
      items.set(key, { field, message } as { field: string; message: string });
    }
  }
  const errors = Array.from(items.values());
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-primary p-4">
      <p>Fel i fil: {file}</p>
      <ul className="flex flex-col gap-1">
        {Array.from(errors)
          .filter((i) => i.message !== "")
          .map(({ field, message }) => (
            <li key={`${file}${field}${message}`}>
              {capitalize(field)}: {message}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ImportErrors;
