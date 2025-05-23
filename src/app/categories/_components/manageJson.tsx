"use client";
import { useState } from "react";
import capitalize from "~/lib/utils/capitalize";
import type { JsonData } from "~/lib/zodSchemas";
import DownloadJsonButton from "./downloadJson";
import UploadJsonButton from "./uploadJson";
import { Button } from "~/components/ui/button";
import { replaceAllMatches } from "../dataLayer/categoriesActions";
import { ClipLoader } from "react-spinners";

type Props = { userId: string };
const ManageJson = ({ userId }: Props) => {
  const [jsonData, setJsonData] = useState<JsonData>([]);
  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    setLoading(true);
    await replaceAllMatches({ data: jsonData, userId });
    setJsonData([]);
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-2">
        <p>Laddar upp...</p>
        <ClipLoader size={50} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        Här kan du ladda ner en säkerhetskopia av alla dina kategorier och
        matchningar i JSON-format. Du kan också ladda upp en tidigare sparad
        kopia.
      </p>
      <div className="flex items-center gap-2">
        <DownloadJsonButton className="w-fit cursor-pointer" userId={userId} />
        <UploadJsonButton onData={setJsonData} />
      </div>
      {jsonData.length !== 0 && (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Kategorier:</h3>
            {jsonData
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, match }, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <h4 className="text-md font-semibold">{capitalize(name)}</h4>
                  <ul className="flex flex-wrap gap-1">
                    {match
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(({ name }, i) => (
                        <li
                          className="rounded-md bg-slate-400 px-2 py-1 text-sm"
                          key={i}
                        >
                          {capitalize(name)}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setJsonData([])}>Stäng</Button>
            <Button disabled={loading} onClick={handleUpload}>
              Spara
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageJson;
