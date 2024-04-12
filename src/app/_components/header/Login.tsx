"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { type Session } from "next-auth";

type Props = { session: Session | null };
const Login = ({ session }: Props) => {
  if (!!session) {
    return (
      <Button
        variant="secondary"
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        Logga ut
      </Button>
    );
  }
  return (
    <Button data-cy="sign-in" onClick={() => void signIn("google")}>
      Logga in
    </Button>
  );
};

export default Login;
