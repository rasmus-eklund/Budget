import {
  Drawer as DrawerShad,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import Icon, { type IconName } from "./Icon";
import { cn } from "~/lib/utils";
import { useStore } from "~/stores/tx-store";

const Drawer = ({
  children,
  icon,
  title,
  className,
}: {
  children: React.ReactNode;
  icon: IconName;
  title: string;
  className?: string;
}) => {
  const { setDrawerOpen } = useStore();
  const drawerOpen = useStore((state) => state.drawerOpen);
  return (
    <DrawerShad open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger>
        <Icon icon={icon} className="size-5" />
      </DrawerTrigger>
      <DrawerContent className={cn("p-2", className)}>
        <DrawerTitle>{title}</DrawerTitle>
        {children}
      </DrawerContent>
    </DrawerShad>
  );
};

export default Drawer;
