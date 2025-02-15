import type { RefObject, SVGProps } from "react";
import svgPaths from "./svgPaths";

type tIcon = keyof typeof svgPaths;
type Props = SVGProps<SVGElement> & {
  ref?: RefObject<SVGSVGElement | null>;
  icon: tIcon;
};

const Icon = ({ icon, ...rest }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <path d={svgPaths[icon]} />
    </svg>
  );
};

export default Icon;
