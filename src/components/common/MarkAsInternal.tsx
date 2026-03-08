"use client";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui";
import { Icon } from "~/components/common";
import type { Tx } from "~/types";
import { useStore } from "~/stores/tx-store";
import { useState } from "react";
import { toast } from "sonner";
import { updateTransaction } from "~/app/transactions/dataLayer/updateTransaction";
import type { FromTo } from "~/lib/zodSchemas";

const MarkAsInternal = ({
  tx,
  changeDates,
}: {
  tx: Tx;
  changeDates: (dates: FromTo) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const password = useStore((state) => state.password);
  const selectedRange = useStore((state) => state.selectedRange);
  const isInternal = tx.budgetgrupp === "inom";

  const handleMarkAsInternal = async () => {
    setLoading(true);
    try {
      const res = await updateTransaction({
        tx,
        internal: !isInternal,
        password,
      });
      if (!res.ok) toast.error(res.error);
      await changeDates(selectedRange);
    } catch (e) {
      console.error(e);
      toast.error("Kunde inte uppdatera transaktionen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          {loading ? (
            <Icon icon="Loader" className="animate-spin" />
          ) : (
            <Icon icon="MoreVertical" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuItem asChild>
          <Button
            onClick={handleMarkAsInternal}
            disabled={loading}
            className="w-full"
            variant="ghost"
          >
            {isInternal ? "Avmarkera" : "Markera"} som inom
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MarkAsInternal;
