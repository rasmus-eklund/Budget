"use client";

const ErrorBoundary = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  console.log(error.message);
  return (
    <div>
      <p>Något gick fel</p>
      <button onClick={reset}>Försök igen</button>
    </div>
  );
};

export default ErrorBoundary;
