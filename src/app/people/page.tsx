import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import capitalize from "~/lib/utils/capitalize";
import {
  addPerson,
  getAllPeople,
  removePerson,
} from "./dataLayer/peopleActions";
import DeleteButton from "~/components/common/Forms/DeleteButton";
import AddItemForm from "~/components/common/Forms/AddItemForm";

const Categories = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const data = await getAllPeople();
  data.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-lg font-semibold">Dina personer:</h2>
      <ul className="flex flex-col gap-1">
        {data.map(({ id, name }) => (
          <li
            className="border-b-red flex h-8 items-center justify-between border-b"
            key={id}
          >
            <Link href={`/people/${name}`}>{capitalize(name)}</Link>
            <form action={removePerson}>
              <input type="text" name="id" hidden defaultValue={id} />
              <DeleteButton />
            </form>
          </li>
        ))}
        {data.length === 0 ? <li>Du har inga personer än.</li> : null}
      </ul>
      <AddItemForm
        onSubmit={addPerson}
        formInfo={{
          label: "Person",
          description: "Lägg till en ny person.",
        }}
        uniques={data.map((i) => i.name)}
      />
    </div>
  );
};

export default Categories;
