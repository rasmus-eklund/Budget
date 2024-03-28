import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import PasswordLayer from "./_components/PasswordLayer";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};
const Month = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return (
    <section className="flex h-full flex-col gap-5 pt-2">
      <PasswordLayer/>
    </section>
  );
};

export default Month;
