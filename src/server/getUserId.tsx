import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getUserId = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    redirect("/api/auth/login");
  }
  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login");
  }
  return user.id;
};

export const isAuthenticated = async () => {
  const { isAuthenticated } = getKindeServerSession();
  return isAuthenticated();
};

export default getUserId;
