import Link from "next/link";
import { FiltersToggle, HeaderMenu } from "~/components/common";
import { isAuthenticated } from "~/server/getUserId";
import { Button } from "~/components/ui";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Header = async () => {
  const authenticated = await isAuthenticated();
  return (
    <header className="relative flex h-14 min-h-14 w-full max-w-5xl items-center border-b px-3">
      <div className="absolute left-2 top-2">
        {authenticated ? (
          <HeaderMenu />
        ) : (
          <Button asChild data-cy="sign-in">
            <LoginLink postLoginRedirectURL="/transactions">Logga in</LoginLink>
          </Button>
        )}
      </div>
      <h1 className="w-full text-nowrap text-center text-xl font-bold text-primary">
        <Link href={"/"}>RICA Banken</Link>
      </h1>
      <FiltersToggle />
    </header>
  );
};

export default Header;
