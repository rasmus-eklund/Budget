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
import capitalize from "~/lib/utils/capitalize";

type Props = {
  href: string;
  name: string;
  options: { id: string; name: string }[];
  current: string;
};
const BreadcrumbWithDropdown = ({ href, name, options, current }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon="slash" className="size-4 fill-slate-500" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {name}
              <Icon icon="chevronDown" className="size-4 fill-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {options.map(({ id, name }) => (
                <DropdownMenuItem asChild key={id}>
                  <BreadcrumbLink href={`${href}/${id}`}>
                    {capitalize(name)}
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
          <BreadcrumbPage>{capitalize(current)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbWithDropdown;
