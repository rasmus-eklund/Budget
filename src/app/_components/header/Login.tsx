"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "../Button";

const Login = () => {
  const { data: session } = useSession();
  if (!!session) {
    return (
      <Button onClick={() => void signOut({ callbackUrl: "/" })}>
        Logga ut
      </Button>
    );
  }
  return (
    <Button
      callToAction
      data-cy="salt-sign-in"
      onClick={() => void signIn("google")}
    >
      Logga in
    </Button>
  );
};

export default Login;
