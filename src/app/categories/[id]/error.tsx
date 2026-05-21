"use client";

import { Button } from "~/components/ui";

const ErrorBoundary = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-2">
      <p>Något gick fel</p>
      <Button onClick={reset}>Försök igen</Button>
    </div>
  );
};

export default ErrorBoundary;
