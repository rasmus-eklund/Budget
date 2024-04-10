"use client";
import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";

type Props = { children: ReactNode };

function Hide({ children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-2 border">
      {open && children}
      <Button
        className="h-5 w-full"
        onClick={() => setOpen((p) => !p)}
        variant={"outline"}
      >
        {open ? (
          <Icon icon="up" className="size-4 fill-gray-600" />
        ) : (
          <Icon icon="down" className="size-4 fill-gray-600" />
        )}
      </Button>
    </div>
  );
}

export default Hide;
