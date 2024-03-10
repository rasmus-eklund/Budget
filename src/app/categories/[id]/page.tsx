import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = { params: { id: string } };

const page = async ({ params: { id } }: Props) => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  const { namn, matches } = await api.categories.get.query({ id });
  return (
    <div className="flex flex-col gap-2 p-2">
      <nav className="flex w-fit gap-2 border p-1">
        <Link href={"/categories"}>kategori</Link>
        <p>{">"}</p>
        <p>{namn}</p>
      </nav>

      <ul>
        {matches.map(({ namn, id }) => (
          <li key={id}>{namn}</li>
        ))}
      </ul>
      <button>Lägg till</button>
    </div>
  );
};

export default page;
