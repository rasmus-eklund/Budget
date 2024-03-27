import Link from "next/link";
import Login from "~/components/common/Login";
import { getServerAuthSession } from "~/server/auth";
import Menu from "./HeaderMenu";

const Header = async () => {
  const session = await getServerAuthSession();
  return (
    <header className="relative flex h-[56px] w-full max-w-5xl items-center justify-between border-b bg-white px-3">
      <Menu />
      <h1 className="w-32 text-center text-xl font-bold text-red-600">
        <Link href={"/"}>RICA Banken</Link>
      </h1>
      <Login session={session} />
    </header>
  );
};

export default Header;
