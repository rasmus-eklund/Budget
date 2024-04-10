"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { env } from "~/env";

import { type Passwords, passwordsSchema } from "~/lib/zodSchemas";
import { usePassword } from "../../_components/PasswordContext";

type Props = {
  onSubmit: (password: string) => void;
};
const defaultValues = {
  password: env.NEXT_PUBLIC_PASS ?? "",
  confirm: env.NEXT_PUBLIC_PASS ?? "",
};
const PasswordForm = ({ onSubmit }: Props) => {
  const { password } = usePassword();
  const form = useForm<Passwords>({
    mode: "all",
    resolver: zodResolver(passwordsSchema),
    defaultValues,
  });

  const handleSubmit = async (data: Passwords) => {
    onSubmit(data.password);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repetera lösenord</FormLabel>
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
  );
};

export default PasswordForm;
