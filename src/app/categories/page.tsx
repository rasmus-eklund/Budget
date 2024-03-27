import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import capitalize from "~/lib/utils/capitalize";
import {
  addCategory,
  getAllCategories,
  removeCategory,
} from "./actions/categoriesActions";
import SubmitButton from "../_components/SubmitButton";
import DeleteButton from "./_components/DeleteButton";

const Categories = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const data = await getAllCategories();
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-1 p-2">
        {data.map(({ id, name }) => (
          <li
            className="border-b-red flex h-8 items-center justify-between border-b"
            key={id}
          >
            <Link href={`/categories/${id}`}>{capitalize(name)}</Link>
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
          className="border-b-red border-b outline-none"
          id="name"
          name="name"
          placeholder="Ny kategori"
        />
        <SubmitButton text="Lägg till" />
      </form>
    </div>
  );
};

export default Categories;
