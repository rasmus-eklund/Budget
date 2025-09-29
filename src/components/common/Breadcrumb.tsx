import {
  Breadcrumb as ShadBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui";
import { Icon } from "~/components/common";
import { capitalize } from "~/lib";

type Props = {
  href: string;
  name: string;
  options: { id: string; name: string }[];
  current: string;
};
const Breadcrumb = ({ href, name, options, current }: Props) => {
  return (
    <ShadBreadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon="Slash" className="size-4 fill-slate-500" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              {name}
              <Icon icon="ChevronDown" className="size-4 fill-slate-500" />
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
          <Icon icon="Slash" className="size-4 fill-slate-500" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{capitalize(current)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </ShadBreadcrumb>
  );
};

export default Breadcrumb;
