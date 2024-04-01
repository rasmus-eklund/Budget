import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import {
  addMatch,
  getMatches,
  removeMatch,
} from "../actions/categoriesActions";
import SubmitButton from "../../_components/SubmitButton";
import DeleteButton from "../_components/DeleteButton";
import capitalize from "~/lib/utils/capitalize";

type Props = { params: { id: string } };

const page = async ({ params: { id: categoryId } }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const { name, matches } = await getMatches({ categoryId });
  return (
    <div className="flex flex-col gap-4 p-2">
      <nav className="flex w-fit gap-2 border p-1">
        <Link href={"/categories"}>kategori</Link>
        <p>{">"}</p>
        <p>{name}</p>
      </nav>

      <ul>
        {matches.map(({ name, id }) => (
          <li
            className="border-b-red flex h-8 items-center justify-between border-b"
            key={id}
          >
            <p>{capitalize(name)}</p>
            <form action={removeMatch}>
              <input hidden name="id" type="text" defaultValue={id} />
              <input
                hidden
                name="budgetgruppId"
                type="text"
                defaultValue={id}
              />
              <DeleteButton />
            </form>
          </li>
        ))}
      </ul>
      <form
        className="flex items-center justify-between gap-2 md:justify-start"
        action={addMatch}
      >
        <label htmlFor="name">Match</label>
        <input
          className="border-b-red min-w-0 border-b outline-none"
          id="name"
          name="name"
          type="text"
          placeholder="Ny match"
        />
        <input
          hidden
          type="text"
          name="budgetgruppId"
          defaultValue={categoryId}
        />
        <SubmitButton text="Lägg till" />
      </form>
    </div>
  );
};

export default page;
