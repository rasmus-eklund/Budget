import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { addMatch, removeMatch } from "../actions/categoriesActions";
import SubmitButton from "../_components/SubmitButton";
import DeleteButton from "../_components/DeleteButton";
import capitalize from "~/utils/capitalize";

type Props = { params: { id: string } };

const page = async ({ params: { id: budgetgruppId } }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const { namn, matches } = await api.categories.get.query({
    id: budgetgruppId,
  });
  return (
    <div className="flex flex-col gap-4 p-2">
      <nav className="flex w-fit gap-2 border p-1">
        <Link href={"/categories"}>kategori</Link>
        <p>{">"}</p>
        <p>{namn}</p>
      </nav>

      <ul>
        {matches.map(({ namn, id }) => (
          <li
            className="flex h-8 items-center justify-between border-b border-b-red"
            key={id}
          >
            <p>{capitalize(namn)}</p>
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
      <form className="flex items-center gap-2" action={addMatch}>
        <label htmlFor="name">Match</label>
        <input
          className="border-b border-b-red outline-none"
          id="name"
          name="name"
          type="text"
          placeholder="Ny match"
        />
        <input
          hidden
          type="text"
          name="budgetgruppId"
          defaultValue={budgetgruppId}
        />
        <SubmitButton />
      </form>
    </div>
  );
};

export default page;
