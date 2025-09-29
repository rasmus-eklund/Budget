import {
  Drawer as DrawerShad,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "~/components/ui";
import { type IconName } from "./Icon";
import { Icon } from "~/components/common";
import { cn } from "~/lib";

const Drawer = ({
  children,
  icon,
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  icon: IconName;
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <DrawerShad direction="right">
      <DrawerTrigger>
        <Icon icon={icon} className="size-5" />
      </DrawerTrigger>
      <DrawerContent className={cn("p-2", className)}>
        <DrawerTitle>{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
        {children}
      </DrawerContent>
    </DrawerShad>
  );
};

export default Drawer;
