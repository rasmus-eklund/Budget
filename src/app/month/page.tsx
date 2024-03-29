import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import PasswordLayer from "./_components/PasswordLayer";

const Month = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return <PasswordLayer />;
};

export default Month;
