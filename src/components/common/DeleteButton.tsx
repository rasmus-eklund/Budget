"use client";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui";
import { Icon } from "~/components/common";

type Props = { icon?: boolean };
const DeleteButton = ({ icon = true }: Props) => {
  const { pending } = useFormStatus();
  if (pending) {
    return <Icon icon="Loader2Icon" className="animate-spin" />;
  } else {
    if (icon) {
      return (
        <button className="hover:scale-110 hover:cursor-pointer">
          <Icon icon="Trash" className="hover:text-primary" />
        </button>
      );
    }
    return (
      <Button
        className="hover:cursor-pointer"
        variant={icon ? "outline" : "destructive"}
      >
        Ta bort
      </Button>
    );
  }
};

export default DeleteButton;
