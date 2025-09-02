import { type ReactNode } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Icon from "~/components/common/Icon";

type Props = { children: ReactNode; info: { title: string; entity: string } };
const DeleteDialog = ({ children, info: { title, entity } }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Icon
            icon="Trash"
            className="size-4 cursor-pointer hover:scale-110 hover:fill-red-600"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ta bort {title.toLowerCase()}</DialogTitle>
          <DialogDescription>
            Detta kommer att ta bort {title.toLowerCase()} tillsammans med alla
            kopplade {entity}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between md:justify-end">
          <DialogClose asChild>
            <Button
              className="hover:cursor-pointer"
              type="button"
              variant="secondary"
            >
              Avbryt
            </Button>
          </DialogClose>
          {children}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
