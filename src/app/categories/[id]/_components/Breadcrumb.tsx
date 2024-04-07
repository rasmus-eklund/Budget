import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Icon from "~/lib/icons/Icon";

type Props = { options: { id: string; name: string }[]; current: string };
const BreadcrumbWithDropdown = ({ options, current }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/categories">Kategorier</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon="slash" className="size-4 fill-slate-500" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              Kategori
              <Icon icon="chevronDown" className="size-4 fill-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {options.map(({ id, name }) => (
                <DropdownMenuItem key={id}>
                  <BreadcrumbLink href={`/categories/${id}`}>
                    {name}
                  </BreadcrumbLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon="slash" className="size-4 fill-slate-500" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbWithDropdown;
