import getUserId from "~/server/getUserId";
import PasswordForm from "./_components/PasswordForm";

const Password = async () => {
  await getUserId();
  return <PasswordForm />;
};

export default Password;
