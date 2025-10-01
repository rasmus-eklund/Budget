"use client";
import { useStore } from "~/stores/tx-store";
import { Button } from "../ui";
import Icon from "./Icon";
import { useMediaQuery } from "~/hooks/use-media-query";
import { useEffect } from "react";

const FiltersToggle = () => {
  const { setShowFilter, setShowDateFilter } = useStore();
  const showFilter = useStore((state) => state.showFilter);
  const showDateFilter = useStore((state) => state.showDateFilter);
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  useEffect(() => {
    setShowFilter(isDesktop);
    setShowDateFilter(isDesktop);
  }, [isDesktop]);
  
  return (
    <div className="absolute right-2 top-2 items-center gap-2 flex md:hidden">
      <Button
        variant="outline"
        className={showFilter ? "border-primary" : ""}
        onClick={() => setShowFilter(!showFilter)}
      >
        <Icon icon="Filter" />
      </Button>
      <Button
        variant="outline"
        className={showDateFilter ? "border-primary" : ""}
        onClick={() => setShowDateFilter(!showDateFilter)}
      >
        <Icon icon="CalendarCheck" />
      </Button>
    </div>
  );
};

export default FiltersToggle;
