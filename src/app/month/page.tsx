import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import FilterLayer from "./_components/FilterLayer";

const Month = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return <FilterLayer />;
};

export default Month;
