"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Icon, { type IconName } from "~/components/common/Icon";

const Menu = () => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const [page, setPage] = React.useState(currentPath);
  const router = useRouter();
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
        <DropdownMenuRadioGroup
          value={page}
          onValueChange={(newPage) => {
            setPage(newPage);
            if (newPage === "password") {
              router.push(`/${newPage}?from=${currentPath}`);
            } else {
              router.push(`/${newPage}`);
            }
          }}
        >
          {items.map(({ name, path, icon }) => (
            <DropdownMenuRadioItem key={path} value={path}>
              <Icon icon={icon} className="mr-2 size-5" />
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="flex items-center gap-2 pl-8">
            <Icon icon="LogOut" className="mr-2 size-5" />
            Logga ut
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
