import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const Home = async () => {
  const session = await getServerAuthSession();

  return (
    <main>
      {session ? <p>welcome {session.user.name}</p> : <p>Not logged in</p>}
      {session && <Link href={"/month"} className="underline">Månatlig budget</Link>}
    </main>
  );
};

export default Home;
