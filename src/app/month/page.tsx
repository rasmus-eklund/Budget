import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import FilterLayer from "./_components/FilterLayer";
import { getYears } from "./dataLayer/getYears";

const Month = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const years = await getYears();
  return <FilterLayer years={years} />;
};

export default Month;
