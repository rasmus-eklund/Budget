import Link from "next/link";
import Menu from "./HeaderMenu";
import { getServerAuthSession } from "~/server/auth";
import LoginComponent from "./Login";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <header className="relative flex h-[56px] w-full max-w-5xl items-center border-b bg-white px-3">
      <div className="flex w-1/3 items-center">
        <Menu hidden={!session} />
      </div>
      <h1 className="w-1/3 text-nowrap text-center text-xl font-bold text-red-600">
        <Link href={"/"}>RICA Banken</Link>
      </h1>
      <div className="flex w-1/3 items-center justify-end gap-2">
        <LoginComponent session={session} />
      </div>
    </header>
  );
};

export default Header;
