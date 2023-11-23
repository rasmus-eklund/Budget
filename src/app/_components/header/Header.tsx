import Login from "./Login";

const Header = () => {
  return (
    <header className="relative flex h-14 w-full max-w-5xl items-center justify-end border-b bg-white px-3">
      <h1 className="absolute left-[calc(50%-64px)] w-32 text-center text-xl font-bold text-red">
        RICA Banken
      </h1>
      <Login />
    </header>
  );
};

export default Header;
