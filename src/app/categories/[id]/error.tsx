"use client";

import { Button } from "~/components/ui/button";

const ErrorBoundary = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2 h-full">
      <p>Något gick fel</p>
      <Button onClick={reset}>Försök igen</Button>
    </div>
  );
};

export default ErrorBoundary;
