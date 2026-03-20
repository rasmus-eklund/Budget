import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getUserId = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/login?reason=session-expired");
  return user.id;
};

export const isAuthenticated = async () => {
  const { isAuthenticated } = getKindeServerSession();
  return isAuthenticated();
};

export default getUserId;
