import PasswordForm from "./_components/PasswordForm";
import { WithAuth } from "~/components/common/withAuth";

const Password = async () => {
  return <PasswordForm />;
};

export default WithAuth(Password);
