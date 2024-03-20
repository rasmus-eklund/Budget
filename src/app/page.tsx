import { getServerAuthSession } from "~/server/auth";
import Login from "./_components/header/Login";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/month");
  }

  return <main className="p-2">{!session && <Login session={session} />}</main>;
};

export default Home;
