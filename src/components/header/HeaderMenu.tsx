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
import Icon from "~/components/common/Icon";

const Menu = () => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const [page, setPage] = React.useState(currentPath);
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Icon icon="Menu" className="size-8" />
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
          <DropdownMenuRadioItem value="transactions">
            <Icon icon="Banknote" className="mr-2 size-6" />
            Transaktioner
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="upload">
            <Icon icon="Upload" className="mr-2 size-6" />
            Ladda upp
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="categories">
            <Icon icon="LayoutGrid" className="mr-2 size-6" />
            Kategorier
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="people">
            <Icon icon="User" className="mr-2 size-6" />
            Personer
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="password">
            <Icon icon="Lock" className="mr-2 size-6" />
            Lösenord
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="flex items-center gap-2 pl-8">
            <Icon icon="LogOut" className="size-8" />
            Logga ut
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
