"use client";
// import { redirect } from "next/navigation";
import Login from "~/components/common/Login";
// import { getServerAuthSession } from "~/server/auth";

const HomePage = () => {
  // const session = await getServerAuthSession();
  // if (session) {
  //   redirect("/month");
  // }

  // return <main className="p-2">{!session && <Login session={session} />}</main>;
  return <Login session={null} />;
};

export default HomePage;
