"use client";
import { useFormStatus } from "react-dom";
import { ClipLoader } from "react-spinners";
import { Button } from "~/components/ui/button";

const SubmitButton = ({ text }: { text: string }) => {
  const { pending } = useFormStatus();
  if (pending) {
    return (
      <Button disabled>
        <ClipLoader size={20} className="mr-2" />
        Vänta
      </Button>
    );
  }
  return <Button>{text}</Button>;
};

export default SubmitButton;
