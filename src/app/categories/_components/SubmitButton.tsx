"use client";
import { useFormStatus } from "react-dom";
import Button from "~/app/_components/Button";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} callToAction type="submit">
      Lägg till
    </Button>
  );
};

export default SubmitButton;
