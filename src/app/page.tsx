import { getServerAuthSession } from "~/server/auth";

const Home = async () => {
  const session = await getServerAuthSession();

  return (
    <main>
      {session ? <p>welcome {session.user.name}</p> : <p>Not logged in</p>}
    </main>
  );
};

export default Home;
