import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const Home = async () => {
  const session = await getServerAuthSession();

  return (
    <main>
      {session ? <p>welcome {session.user.name}</p> : <p>Not logged in</p>}
      {session && (
        <ul>
          <li>
            <Link href={"/month"} className="underline">
              Månatlig budget
            </Link>
          </li>
          <li>
            <Link href={"/categories"} className="underline">
              Kategorier
            </Link>
          </li>
        </ul>
      )}
    </main>
  );
};

export default Home;
