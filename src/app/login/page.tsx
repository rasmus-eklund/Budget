import Link from "next/link";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "~/components/ui";

type Props = {
  searchParams: Promise<{
    reason?: string;
  }>;
};

const LoginPage = async ({ searchParams }: Props) => {
  const { reason } = await searchParams;
  const expired = reason === "session-expired";

  return (
    <section className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Logga in</h1>
          <p className="text-sm text-muted-foreground">
            {expired
              ? "Din session verkar ha gått ut. Starta en ny inloggning for att fortsätta."
              : "Logga in for att komma vidare till appen."}
          </p>
        </div>

        <Button asChild className="w-full">
          <LoginLink postLoginRedirectURL="/transactions">
            Fortsätt till inloggning
          </LoginLink>
        </Button>

        <Button asChild variant="ghost" className="w-full">
          <Link href="/">Till startsidan</Link>
        </Button>
      </div>
    </section>
  );
};

export default LoginPage;
