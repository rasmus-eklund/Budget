import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/month");
  }
  return (
    <div className="p-2">
      {!session && <p>Välkommen till din RICA Banken!</p>}
    </div>
  );
};

export default HomePage;
