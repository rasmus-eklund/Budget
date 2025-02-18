"use client";
import { useFormStatus } from "react-dom";
import { ClipLoader } from "react-spinners";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";

type Props = { icon?: boolean };
const DeleteButton = ({ icon = true }: Props) => {
  const { pending } = useFormStatus();
  if (pending) {
    return <ClipLoader size={18} />;
  } else {
    if (icon) {
      return (
        <button className="hover:scale-110 hover:cursor-pointer">
          <Icon
            icon="delete"
            className="size-4 fill-black hover:fill-red-600"
          />
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
