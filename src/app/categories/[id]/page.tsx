import {
  addMatch,
  getAllCategories,
  getMatches,
  removeMatch,
  renameMatch,
} from "../dataLayer/categoriesActions";
import DeleteButton from "~/components/common/Forms/DeleteButton";
import capitalize from "~/lib/utils/capitalize";
import BreadcrumbWithDropdown from "~/components/common/Breadcrumb";
import AddItemForm from "~/components/common/Forms/AddItemForm";
import type { Name } from "~/types";
import EditItemForm from "~/components/common/Forms/EditItemForm";
import { WithAuth, type WithAuthProps } from "~/components/common/withAuth";

type Props = { params: Promise<{ id: string }> };

const page = async (props: Props & WithAuthProps) => {
  const params = await props.params;
  const { id: categoryId } = params;
  const { userId } = props;
  const options = await getAllCategories(userId);
  const { name, match, unique } = await getMatches({ categoryId, userId });
  const onSubmit = async ({ name }: Name) => {
    "use server";
    await addMatch({ name, categoryId });
  };
  return (
    <div className="flex flex-col gap-4 p-2">
      <BreadcrumbWithDropdown
        href="\categories"
        name="Kategorier"
        options={options}
        current={name}
      />
      <h2 className="text-lg font-semibold">{capitalize(name)}</h2>
      <ul>
        {match
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map(({ name, id }) => (
            <li
              className="border-b-red flex h-8 items-center justify-between border-b"
              key={id}
            >
              <p>{capitalize(name)}</p>
              <div className="flex items-center gap-2">
                <EditItemForm
                  data={{ name, id }}
                  onSubmit={renameMatch}
                  formInfo={{
                    description: "Detta kommer att ändra nyckelordets namn",
                    label: "Namn",
                  }}
                  uniques={unique}
                />
                <form className="flex items-center" action={removeMatch}>
                  <input hidden name="id" type="text" defaultValue={id} />
                  <input
                    hidden
                    name="budgetgruppId"
                    type="text"
                    defaultValue={id}
                  />
                  <DeleteButton />
                </form>
              </div>
            </li>
          ))}
      </ul>
      <AddItemForm
        onSubmit={onSubmit}
        formInfo={{
          label: "Nyckelord",
          description: `Lägg till nyckelord för att kategorisera transaktion som ${name.toLowerCase()}`,
        }}
        uniques={unique}
      />
    </div>
  );
};

export default WithAuth(page);
