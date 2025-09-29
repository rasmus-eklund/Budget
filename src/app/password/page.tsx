import PasswordForm from "./_components/PasswordForm";
import WithAuth from "~/components/server/WithAuth";

const Password = async () => {
  return <PasswordForm />;
};

export default WithAuth(Password);
