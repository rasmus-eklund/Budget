import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/transactions");
  }
  return (
    <div className="flex h-1/3 flex-col items-center justify-center p-2">
      <p>Välkommen till din RICA Banken!</p>
      <Button variant="link">
        <Link href={"/demo"}>Prova demo</Link>
      </Button>
    </div>
  );
};

export default HomePage;
