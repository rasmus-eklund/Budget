"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Icon from "~/icons/Icon";

const Menu = () => {
  const [page, setPage] = React.useState("month");
  const router = useRouter();
  React.useEffect(() => {
    router.push(`/${page}`);
  }, [page, router]);
  return (
    <DropdownMenu className="bg-white">
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <Icon icon="hamburgerMenu" className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuRadioGroup value={page} onValueChange={setPage}>
          <DropdownMenuRadioItem value="month">
            <Icon icon="cash" className="mr-2 size-6" />
            Transaktioner
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="upload">
            <Icon icon="upload" className="mr-2 size-6" />
            Ladda upp
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="categories">
            <Icon icon="cog" className="mr-2 size-6" />
            Kategorier
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
