import Link from "next/link";
import Login from "./Login";
import { getServerAuthSession } from "~/server/auth";

const Header = async () => {
  const session = await getServerAuthSession();
  return (
    <header className="relative flex h-14 w-full max-w-5xl items-center justify-end border-b bg-white px-3">
      <h1 className="absolute left-[calc(50%-64px)] w-32 text-center text-xl font-bold text-red">
        <Link href={"/"}>RICA Banken</Link>
      </h1>
      <Login session={session} />
    </header>
  );
};

export default Header;
