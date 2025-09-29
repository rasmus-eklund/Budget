"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "~/components/ui";
import { type JsonData, jsonSchema } from "~/lib/zodSchemas";

type Props = { className?: string; onData: (data: JsonData) => void };
const UploadJsonButton = ({ className, onData }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];

    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("Invalid json fil.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            return;
          }
          const parsed = jsonSchema.safeParse(
            JSON.parse(e.target.result as string),
          );
          if (!parsed.success) {
            setError("Fel i JSON-filen.");
            return;
          }
          onData(parsed.data);
        } catch (error) {
          console.error(error);
          setError("Fel i JSON-filen.");
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className={className}>
      <Button variant="outline" asChild className="cursor-pointer">
        <label htmlFor="json-upload">Ladda upp</label>
      </Button>
      <input
        className="hidden"
        id="json-upload"
        type="file"
        accept="application/json, .json"
        onClick={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = "";
          onData([]);
        }}
        onChange={handleFileUpload}
      />

      {error && <p className="text-primary">{error}</p>}
    </div>
  );
};

export default UploadJsonButton;
