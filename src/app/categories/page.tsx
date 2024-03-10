import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Link from "next/link";
import AddCategory from "./_components/AddCategory";
import capitalize from "~/utils/capitalize";

const Categories = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const data = await api.categories.getAll.query();
  return (
    <div>
      <ul className="flex flex-col gap-1 p-2">
        {data.map(({ id, namn }) => (
          <li className="border-b border-b-red" key={id}>
            <Link href={`/categories/${id}`}>{capitalize(namn)}</Link>
          </li>
        ))}
      </ul>
      <AddCategory />
    </div>
  );
};

export default Categories;
