"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import capitalize from "~/lib/utils/capitalize";

type Name = { name: string };
type Props = {
  onSubmit: (name: Name) => Promise<void>;
  formInfo: { label: string; description: string };
  uniques: string[];
};

const AddItemForm = ({
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
  const form = useForm<Name>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });
  const handleSubmit = async (name: Name) => {
    await onSubmit(name);
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input placeholder={`Ny ${label.toLowerCase()}`} {...field} />
              </FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.isSubmitting ? (
          <Button disabled>
            <ClipLoader size={20} className="mr-2" />
            Vänta
          </Button>
        ) : (
          <Button type="submit" disabled={!form.formState.isValid}>
            Lägg till
          </Button>
        )}
      </form>
    </Form>
  );
};

export default AddItemForm;
