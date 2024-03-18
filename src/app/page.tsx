import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const Home = async () => {
  const session = await getServerAuthSession();

  return (
    <main className="p-2">
      {session ? <p>Välkommen {session.user.name}</p> : <p>Logga in för att se din budget.</p>}
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
          <li>
            <Link href={"/upload"} className="underline">
              Ladda upp filer
            </Link>
          </li>
        </ul>
      )}
    </main>
  );
};

export default Home;
