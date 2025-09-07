import {
  Drawer as DrawerShad,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import Icon, { type IconName } from "./Icon";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";

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
  return (
    <DrawerShad>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon icon={icon} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className={cn("p-2", className)}>
        <DrawerTitle>{title}</DrawerTitle>
        {children}
      </DrawerContent>
    </DrawerShad>
  );
};

export default Drawer;
