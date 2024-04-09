"use client";

const ErrorBoundary = ({ reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <p>Något gick fel</p>
      <button onClick={reset}>Försök igen</button>
    </div>
  );
};

export default ErrorBoundary;
