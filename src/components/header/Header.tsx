import Link from "next/link";
import Menu from "./HeaderMenu";
import LoginComponent from "./Login";
import { isAuthenticated } from "~/server/getUserId";

const Header = async () => {
  const authenticated = await isAuthenticated();
  return (
    <header className="relative flex h-[56px] w-full max-w-5xl items-center border-b bg-white px-3">
      <div className="flex w-1/3 items-center">
        <Menu hidden={!authenticated} />
      </div>
      <h1 className="w-1/3 text-nowrap text-center text-xl font-bold text-red-600">
        <Link href={"/"}>RICA Banken</Link>
      </h1>
      <div className="flex w-1/3 items-center justify-end gap-2">
        <LoginComponent authenticated={authenticated} />
      </div>
    </header>
  );
};

export default Header;
