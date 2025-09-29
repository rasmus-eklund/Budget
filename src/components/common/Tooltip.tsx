import {
  Tooltip as TooltipShad,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui";

const Tooltip = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <TooltipShad>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{title}</p>
      </TooltipContent>
    </TooltipShad>
  );
};

export default Tooltip;
