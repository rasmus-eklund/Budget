"use client";
import { useState, type ReactNode } from "react";
import { Button } from "~/components/ui/button";

type Props = { children: ReactNode };

function Hide({ children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col gap-2 border p-2">
      {open && children}
      <Button
        className="w-[200px] self-center"
        onClick={() => setOpen((p) => !p)}
        variant={"outline"}
      >
        {open ? "Dölj" : "Visa"}
      </Button>
    </div>
  );
}

export default Hide;
