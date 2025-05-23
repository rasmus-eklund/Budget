import Link from "next/link";
import capitalize from "~/lib/utils/capitalize";
import {
  addCategory,
  getAllCategories,
  removeCategory,
  renameCategory,
} from "./dataLayer/categoriesActions";
import DeleteButton from "~/components/common/Forms/DeleteButton";
import AddItemForm from "~/components/common/Forms/AddItemForm";
import ManageJson from "./_components/manageJson";
import DeleteDialog from "~/components/common/Forms/DeleteDialog";
import EditItemForm from "~/components/common/Forms/EditItemForm";
import { WithAuth, type WithAuthProps } from "~/components/common/withAuth";
import { type Name } from "~/types";

const Categories = async ({ userId }: WithAuthProps) => {
  const data = await getAllCategories(userId);
  const handleAddCategory = async ({ name }: Name) => {
    "use server";
    await addCategory({ name, userId });
  };
  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-lg font-semibold">Dina kategorier:</h2>
      <ul className="flex flex-col gap-1">
        {data.length === 0 ? (
          <li>Du har inga kategorier än.</li>
        ) : (
          data
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map(({ id, name }) => (
              <li
                className="border-b-red flex h-8 items-center justify-between border-b"
                key={id}
              >
                <Link
                  className="hover:cursor-pointer"
                  href={`/categories/${id}`}
                >
                  {capitalize(name)}
                </Link>
                <div className="flex items-center gap-2">
                  <EditItemForm
                    data={{ name, id }}
                    onSubmit={renameCategory}
                    formInfo={{
                      description: "Detta kommer att ändra kategorins namn",
                      label: "Namn",
                    }}
                    uniques={data.map((i) => i.name)}
                  />
                  <DeleteDialog
                    info={{ title: "kategorin", entity: "matchningar" }}
                  >
                    <form action={removeCategory}>
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
        onSubmit={handleAddCategory}
        formInfo={{
          label: "Kategori",
          description: "Lägg till en ny kategori.",
        }}
        uniques={data.map((i) => i.name)}
      />
      <ManageJson userId={userId} />
    </div>
  );
};

export default WithAuth(Categories);
