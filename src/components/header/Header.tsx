import Link from "next/link";
import Login from "~/components/header/Login";
import { getServerAuthSession } from "~/server/auth";
import Menu from "./HeaderMenu";

const Header = async () => {
  const session = await getServerAuthSession();
  return (
    <header className="relative flex h-[56px] w-full max-w-5xl items-center border-b bg-white px-3">
      <div className="flex w-1/3 items-center">
        <Menu hidden={!session} />
      </div>
      <h1 className="w-1/3 text-center text-xl font-bold text-red-600">
        <Link href={"/"}>RICA Banken</Link>
      </h1>
      <div className="flex w-1/3 items-center justify-end">
        <Login session={session} />
      </div>
    </header>
  );
};

export default Header;
