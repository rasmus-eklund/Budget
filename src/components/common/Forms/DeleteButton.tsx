"use client";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import Icon from "~/components/common/Icon";

type Props = { icon?: boolean };
const DeleteButton = ({ icon = true }: Props) => {
  const { pending } = useFormStatus();
  if (pending) {
    return <Icon icon="Loader2Icon" className="animate-spin" />;
  } else {
    if (icon) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="hover:scale-110 hover:cursor-pointer hover:bg-white"
        >
          <Icon icon="Trash" className="hover:text-red-600" />
        </Button>
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
