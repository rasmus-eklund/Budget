"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
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
import { type Name, nameSchema } from "~/lib/zodSchemas";

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
  const form = useForm<Name>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });
  const isUnique = async ({ name }: Name) => {
    if (uniques.includes(name)) {
      form.setError("name", {
        message: `${capitalize(name)} finns redan som ${label.toLowerCase()}`,
      });
      return;
    }
    await onSubmit({ name });
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(isUnique)} className="space-y-8">
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
