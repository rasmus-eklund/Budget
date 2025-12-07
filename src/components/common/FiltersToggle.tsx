"use client";
import { useStore } from "~/stores/tx-store";
import { Button } from "../ui";
import Icon from "./Icon";
import { useMediaQuery } from "~/hooks/use-media-query";
import { useEffect } from "react";
import { cn } from "~/lib";

const FiltersToggle = () => {
  const setShowFilter = useStore((state) => state.setShowFilter);
  const setShowDateFilter = useStore((state) => state.setShowDateFilter);
  const showFilter = useStore((state) => state.showFilter);
  const showDateFilter = useStore((state) => state.showDateFilter);
  const filterTab = useStore((state) => state.filterTab);
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  useEffect(() => {
    setShowFilter(isDesktop);
    setShowDateFilter(isDesktop);
  }, [isDesktop, setShowFilter, setShowDateFilter]);

  return (
    <div className="absolute right-2 top-2 items-center gap-2 flex md:hidden">
      <Button
        variant="outline"
        className={cn(
          showFilter ? "border-primary" : "",
          filterTab === "aggregated" ? "hidden" : "",
        )}
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
