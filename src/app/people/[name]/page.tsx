import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import {
  addBankAccount,
  getBankAccounts,
  getAllPeople,
  removeBankAccount,
} from "../dataLayer/peopleActions";
import DeleteButton from "../../../components/common/Forms/DeleteButton";
import capitalize from "~/lib/utils/capitalize";
import BreadcrumbWithDropdown from "../../../components/common/Breadcrumb";
import AddItemForm from "../../../components/common/Forms/AddItemForm";
import type { Name } from "~/lib/zodSchemas";

type Props = { params: { name: string } };

const page = async ({ params: { name: personName } }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const options = await getAllPeople();
  const {
    name,
    bankAccounts,
    id: personId,
  } = await getBankAccounts({
    name: personName,
  });
  bankAccounts.sort((a, b) => a.name.localeCompare(b.name));
  const onSubmit = async ({ name }: Name) => {
    "use server";
    await addBankAccount({ name, personId });
  };
  return (
    <div className="flex flex-col gap-4 p-2">
      <BreadcrumbWithDropdown
        href="/people"
        name="Personer"
        options={options.map((i) => ({ id: i.name, name: i.name }))}
        current={name}
      />
      <h2 className="text-lg font-semibold">{capitalize(name)}</h2>
      <ul>
        {bankAccounts.map(({ name, id }) => (
          <li
            className="border-b-red flex h-8 items-center justify-between border-b"
            key={id}
          >
            <p>{capitalize(name)}</p>
            <form action={removeBankAccount}>
              <input hidden name="id" type="text" defaultValue={id} />
              <input hidden name="name" type="text" defaultValue={personName} />
              <DeleteButton />
            </form>
          </li>
        ))}
      </ul>
      <AddItemForm
        onSubmit={onSubmit}
        formInfo={{
          label: "Konto",
          description: `Lägg till konto för ${personName.toLowerCase()}`,
        }}
        uniques={bankAccounts.map((i) => i.name)}
      />
    </div>
  );
};

export default page;
