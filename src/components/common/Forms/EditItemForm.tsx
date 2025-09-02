"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import Icon from "~/components/common/Icon";
import { z } from "zod";
type Props = {
  data: { name: string; id: string };
  onSubmit: (data: { name: string; id: string }) => Promise<void>;
  formInfo: { label: string; description: string };
  uniques: string[];
};
type Name = { name: string };

const EditItemForm = ({
  data,
  onSubmit,
  formInfo: { description, label },
  uniques,
}: Props) => {
  const nameSchema = z
    .object({ name: z.string().min(2, "Minst 2 tecken.") })
    .refine(
      (v) =>
        !uniques.map((i) => i.toLowerCase()).includes(v.name.toLowerCase()),
      (v) => ({
        message: `${capitalize(v.name)} finns redan som ${label.toLowerCase()}`,
        path: ["name"],
      }),
    );
  const [open, setOpen] = useState(false);
  const form = useForm<Name>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: data.name },
    mode: "onChange",
  });
  const handleSubmit = async ({ name }: Name) => {
    await onSubmit({ name, id: data.id });
    form.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)}>
          <Icon
            icon="Pencil"
            className="size-5 hover:scale-110 hover:cursor-pointer"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ändra {label.toLowerCase()}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
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
                <Button
                  className="hover:cursor-pointer"
                  type="button"
                  variant="outline"
                >
                  Stäng
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    Vänta
                    <Icon icon="Loader2Icon" className="animate-spin" />
                  </>
                ) : (
                  "Ändra"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemForm;
