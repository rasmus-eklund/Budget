"use client";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "~/components/ui/button";

type Props = { authenticated: boolean };
const LoginComponent = ({ authenticated }: Props) => {
  if (!authenticated) {
    return (
      <Button asChild data-cy="sign-in">
        <LoginLink postLoginRedirectURL="/transactions">Logga in</LoginLink>
      </Button>
    );
  }
  return (
    <Button asChild variant="secondary">
      <LogoutLink>Logga ut</LogoutLink>
    </Button>
  );
};

export default LoginComponent;
