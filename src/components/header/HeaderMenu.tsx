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
import Icon from "~/lib/icons/Icon";

const Menu = () => {
  const pathname = usePathname();
  const currentPath = pathname.split("/")[1];
  const [page, setPage] = React.useState(currentPath ?? "transactions");
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="bg-white">
          <Icon icon="hamburgerMenu" className="size-8" />
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
            <Icon icon="cash" className="mr-2 size-6" />
            Transaktioner
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="upload">
            <Icon icon="upload" className="mr-2 size-6" />
            Ladda upp
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="categories">
            <Icon icon="categories" className="mr-2 size-6" />
            Kategorier
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="people">
            <Icon icon="user" className="mr-2 size-6" />
            Personer
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="password">
            <Icon icon="password" className="mr-2 size-6" />
            Lösenord
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="flex items-center gap-2 pl-8">
            <Icon icon="logout" className="size-8" />
            Logga ut
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
