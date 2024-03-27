import { redirect } from "next/navigation";
import { getServerAuthSession } from "./auth";

const getUserId = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return session.user.id;
};

export default getUserId;
