import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import capitalize from "~/lib/utils/capitalize";
import {
  addPerson,
  getAllPeople,
  removePerson,
  renamePerson,
} from "./dataLayer/peopleActions";
import DeleteButton from "~/components/common/Forms/DeleteButton";
import AddItemForm from "~/components/common/Forms/AddItemForm";
import DeleteDialog from "~/components/common/Forms/DeleteDialog";
import EditItemForm from "~/components/common/Forms/EditItemForm";

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
            <div className="flex items-center gap-2">
              <EditItemForm
                data={{ name, id }}
                onSubmit={renamePerson}
                formInfo={{
                  description: "Detta kommer att ändra personens namn",
                  label: "Namn",
                }}
                uniques={data.map((i) => i.name)}
              />
              <DeleteDialog info={{ title: "personen" }}>
                <form action={removePerson} className="flex items-center">
                  <input hidden name="id" type="text" defaultValue={id} />
                  <DeleteButton icon={false} />
                </form>
              </DeleteDialog>
            </div>
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
