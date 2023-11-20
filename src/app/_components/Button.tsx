import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  callToAction?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({
  className: inClass = "",
  callToAction = false,
  ...props
}: ButtonProps) {
  const className = {
    colors: callToAction
      ? "bg-red md:hover:bg-darkRed text-white md:hover:text-white active:bg-black"
      : "bg-white md:hover:bg-red text-black md:hover:text-white active:bg-black",
  };
  return (
    <button
      className={`${className.colors} ${inClass} lg:text-md flex justify-center items-center rounded-sm px-4 py-[6px] font-secondary text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-50 xs:px-2 xs:py-[6px] lg:h-9 lg:px-6`}
      {...props}
    ></button>
  );
}

export default Button;
