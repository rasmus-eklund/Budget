"use client";
import { Button } from "~/components/ui";
import { getAllMatches } from "../dataLayer/categoriesActions";
import { useState } from "react";

const DownloadJsonButton = ({
  className,
  userId,
}: {
  className?: string;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const data = await getAllMatches(userId);
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "categories.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      className={className}
      disabled={loading}
      onClick={handleDownload}
    >
      Ladda ner
    </Button>
  );
};

export default DownloadJsonButton;
