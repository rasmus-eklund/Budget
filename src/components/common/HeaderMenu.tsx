"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { usePathname } from "next/navigation";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui";
import { type IconName } from "~/components/common/Icon";
import { Icon } from "~/components/common";
import Link from "next/link";
import { cn } from "~/lib";

const HeaderMenu = () => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const items: { name: string; path: string; icon: IconName }[] = [
    { name: "Transaktioner", path: "transactions", icon: "Banknote" },
    { name: "Ladda upp", path: "upload", icon: "Upload" },
    { name: "Kategorier", path: "categories", icon: "LayoutGrid" },
    { name: "Personer", path: "people", icon: "User" },
    { name: "Lösenord", path: "password", icon: "Lock" },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Icon icon="Menu" className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {items.map(({ name, path, icon }) => (
          <DropdownMenuItem asChild key={path}>
            <Link
              className={cn(
                "flex gap-2 items-center",
                currentPath === path ? "text-primary" : "",
              )}
              href={
                path === "password"
                  ? `/${path}?from=${currentPath}`
                  : `/${path}`
              }
            >
              <Icon icon={icon} className="mr-2 size-5" />
              {name}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="flex items-center gap-2">
            <Icon icon="LogOut" className="mr-2 size-5" />
            Logga ut
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;
