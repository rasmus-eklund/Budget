import {
  addBankAccount,
  getBankAccounts,
  getAllPeople,
  removeBankAccount,
  renameBankAccount,
} from "../dataLayer/peopleActions";
import DeleteButton from "~/components/common/Forms/DeleteButton";
import capitalize from "~/lib/utils/capitalize";
import BreadcrumbWithDropdown from "~/components/common/Breadcrumb";
import AddItemForm from "~/components/common/Forms/AddItemForm";
import type { Name } from "~/types";
import EditItemForm from "~/components/common/Forms/EditItemForm";
import DeleteDialog from "~/components/common/Forms/DeleteDialog";
import { WithAuth, type WithAuthProps } from "~/components/common/withAuth";

type Props = { params: Promise<{ id: string }> };

const page = async (props: Props & WithAuthProps) => {
  const { id } = await props.params;
  const { userId } = props;
  const options = await getAllPeople(userId);
  const {
    name,
    bankAccounts,
    id: personId,
  } = await getBankAccounts({ id, userId });
  const addAccount = async ({ name }: Name) => {
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
        {!bankAccounts || bankAccounts.length === 0 ? (
          <li>Du har inga bankkonton än.</li>
        ) : (
          bankAccounts
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map(({ name, id: bankAccountId }) => (
              <li
                className="border-b-red flex h-8 items-center justify-between border-b"
                key={bankAccountId}
              >
                <p>{capitalize(name)}</p>
                <div className="flex items-center gap-2">
                  <EditItemForm
                    data={{ name, id: bankAccountId }}
                    uniques={bankAccounts.map(({ name }) => name)}
                    onSubmit={renameBankAccount}
                    formInfo={{
                      description: "Detta kommer att ändra ditt kontonamn",
                      label: "Kontonamn",
                    }}
                  />
                  <DeleteDialog
                    info={{ title: "ditt bankkonto", entity: "bankloggar" }}
                  >
                    <form
                      action={removeBankAccount}
                      className="flex items-center"
                    >
                      <input
                        hidden
                        name="bankAccountId"
                        type="text"
                        defaultValue={bankAccountId}
                      />
                      <input hidden name="id" type="text" defaultValue={id} />
                      <DeleteButton icon={false} />
                    </form>
                  </DeleteDialog>
                </div>
              </li>
            ))
        )}
      </ul>
      <AddItemForm
        onSubmit={addAccount}
        formInfo={{
          label: "Konto",
          description: `Lägg till konto för ${name.toLowerCase()}`,
        }}
        uniques={bankAccounts.map((i) => i.name)}
      />
    </div>
  );
};

export default WithAuth(page);
