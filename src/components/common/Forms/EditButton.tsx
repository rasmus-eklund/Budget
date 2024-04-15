"use client";
import { type ReactNode, useState } from "react";
import { useFormStatus } from "react-dom";
import { ClipLoader } from "react-spinners";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";

type Props = { children: ReactNode };
const EditButton = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <ClipLoader size={18} />
      ) : (
        <Button
          onClick={() => setOpen((p) => !p)}
          variant={"outline"}
          size="icon"
        >
          <Icon
            icon="edit"
            className="hover:fill-red size-4 fill-black hover:scale-110"
          />
        </Button>
      )}
      {open ? { children } : null}
    </>
  );
};

export default EditButton;
