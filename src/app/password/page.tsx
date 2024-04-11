import { getServerAuthSession } from "~/server/auth";
import PasswordForm from "./_components/PasswordForm";
import { redirect } from "next/navigation";

const Password = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return <PasswordForm />;
};

export default Password;
