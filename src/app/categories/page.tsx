import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Link from "next/link";
import AddCategory from "./_components/AddCategory";

const Categories = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const data = await api.categories.getAll.query();
  return (
    <div>
      <ul>
        {data.map(({ id, namn }) => (
          <li key={id}>
            <Link href={`/categories/${id}`}>{namn}</Link>
          </li>
        ))}
      </ul>
      <AddCategory />
    </div>
  );
};

export default Categories;
