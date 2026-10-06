import * as React from "react";
import { Tooltip as TooltipShad, TooltipContent, TooltipTrigger } from "~/components/ui";

const Tooltip = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <TooltipShad>
      <TooltipTrigger
        render={React.isValidElement(children) ? children : <span>{children}</span>}
      />
      <TooltipContent>
        <p>{title}</p>
      </TooltipContent>
    </TooltipShad>
  );
};

export default Tooltip;
