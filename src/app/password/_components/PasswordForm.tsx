"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  Input,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
} from "~/components/ui";
import { env } from "~/env";
import { type Passwords, passwordsSchema } from "~/lib/zodSchemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "~/stores/tx-store";

const defaultValues = {
  password: env.NEXT_PUBLIC_PASS ?? "",
};
const PasswordForm = () => {
  const { updatePassword } = useStore();
  const password = useStore((state) => state.password);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const error = searchParams.get("error");
  const form = useForm<Passwords>({
    mode: "all",
    resolver: zodResolver(passwordsSchema),
    defaultValues: defaultValues.password === "" ? { password } : defaultValues,
  });

  const handleSubmit = async (data: Passwords) => {
    updatePassword(data.password);
    router.push(`/${from ?? "transactions"}`);
  };
  return (
    <>
      {error && (
        <p className="p-4">
          Fel lösenord. Kunde inte avkryptera dina bankloggar.
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 p-8"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lösenord</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Lösenordet används för att kryptera och avkryptera dina
                  bankloggar.
                </FormDescription>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isValid}>
            Använd lösenordet
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PasswordForm;
