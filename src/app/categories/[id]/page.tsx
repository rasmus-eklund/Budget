import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import {
  addMatch,
  getAllCategories,
  getMatches,
  removeMatch,
} from "../dataLayer/categoriesActions";
import DeleteButton from "../_components/DeleteButton";
import capitalize from "~/lib/utils/capitalize";
import BreadcrumbWithDropdown from "./_components/Breadcrumb";
import AddItemForm from "../_components/AddItemForm";
import type { Name } from "~/lib/zodSchemas";

type Props = { params: { id: string } };

const page = async ({ params: { id: categoryId } }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const options = await getAllCategories();
  const { name, matches, unique } = await getMatches({ categoryId });
  matches.sort((a, b) => a.name.localeCompare(b.name));
  const onSubmit = async ({ name }: Name) => {
    "use server";
    await addMatch({ name, categoryId });
  };
  return (
    <div className="flex flex-col gap-4 p-2">
      <BreadcrumbWithDropdown options={options} current={name} />
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
      <AddItemForm
        onSubmit={onSubmit}
        formInfo={{
          label: "Nyckelord",
          description: `Lägg till nyckelord för att kategorisera transaktion som ${name.toLowerCase()}`,
        }}
        uniques={unique.map((i) => i.name)}
      />
    </div>
  );
};

export default page;
