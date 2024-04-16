"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import capitalize from "~/lib/utils/capitalize";
import { type Name, nameSchema } from "~/lib/zodSchemas";
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

import { Button } from "~/components/ui/button";
import Icon from "~/lib/icons/Icon";
type Props = {
  data: { name: string; id: string };
  onSubmit: (data: { name: string; id: string }) => Promise<void>;
  formInfo: { label: string; description: string };
  uniques: string[];
};

const EditItemForm = ({
  data,
  onSubmit,
  formInfo: { description, label },
  uniques,
}: Props) => {
  const [open, setOpen] = useState(false);
  const form = useForm<Name>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: data.name },
  });
  const isUnique = async ({ name }: Name) => {
    if (uniques.includes(name)) {
      form.setError("name", {
        message: `${capitalize(name)} finns redan som ${label.toLowerCase()}`,
      });
      return;
    }
    await onSubmit({ name, id: data.id });
    form.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)}>
          <Icon icon="edit" className="size-5 hover:scale-110" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ändra {label.toLowerCase()}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(isUnique)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Ny ${label.toLowerCase()}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-row justify-between md:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Stäng
                </Button>
              </DialogClose>
              {form.formState.isSubmitting ? (
                <Button disabled>
                  <ClipLoader size={20} className="mr-2" />
                  Vänta
                </Button>
              ) : (
                <Button type="submit" disabled={!form.formState.isValid}>
                  Ändra
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemForm;
