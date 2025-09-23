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
import { WithAuth, type WithAuthProps } from "~/components/common/withAuth";
import { type Name } from "~/types";

const Categories = async ({ userId }: WithAuthProps) => {
  const data = await getAllPeople(userId);
  const handleAddPerson = async ({ name }: Name) => {
    "use server";
    await addPerson({ name, userId });
  };
  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-lg font-semibold">Dina personer:</h2>
      <ul className="flex flex-col gap-1">
        {!data || data.length === 0 ? (
          <li>Du har inga personer än.</li>
        ) : (
          data
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map(({ id, name }) => (
              <li
                className="border-b-red flex h-8 items-center justify-between border-b"
                key={id}
              >
                <Link href={`/people/${id}`}>{capitalize(name)}</Link>
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
                  <DeleteDialog
                    info={{ title: "personen", entity: "bankloggar" }}
                  >
                    <form action={removePerson} className="flex items-center">
                      <input hidden name="id" type="text" defaultValue={id} />
                      <input
                        hidden
                        name="userId"
                        type="text"
                        defaultValue={userId}
                      />
                      <DeleteButton icon={false} />
                    </form>
                  </DeleteDialog>
                </div>
              </li>
            ))
        )}
      </ul>
      <AddItemForm
        onSubmit={handleAddPerson}
        formInfo={{
          label: "Person",
          description: "Lägg till en ny person.",
        }}
        uniques={data.map((i) => i.name)}
      />
    </div>
  );
};

export default WithAuth(Categories);
