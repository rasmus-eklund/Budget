import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Link from "next/link";
import capitalize from "~/utils/capitalize";
import { addCategory, removeCategory } from "./actions/categoriesActions";
import SubmitButton from "./_components/SubmitButton";
import DeleteButton from "./_components/DeleteButton";

const Categories = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const data = await api.categories.getAll.query();
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-1 p-2">
        {data.map(({ id, namn }) => (
          <li
            className="flex h-8 items-center justify-between border-b border-b-red"
            key={id}
          >
            <Link href={`/categories/${id}`}>{capitalize(namn)}</Link>
            <form action={removeCategory}>
              <input hidden name="id" type="text" defaultValue={id} />
              <DeleteButton />
            </form>
          </li>
        ))}
      </ul>
      <form className="flex items-center gap-2" action={addCategory}>
        <label htmlFor="name">Kategori</label>
        <input
          className="border-b border-b-red outline-none"
          id="name"
          name="name"
          placeholder="Ny kategori"
        />
        <SubmitButton />
      </form>
    </div>
  );
};

export default Categories;
