import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { ClipLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

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
  disabled,
  ...props
}: ButtonProps) {
  const className = {
    colors: callToAction
      ? "bg-red md:hover:bg-darkRed text-white md:hover:text-white active:bg-black"
      : "bg-white md:hover:bg-red text-black md:hover:text-white active:bg-black",
  };
  return (
    <div
      className={twMerge(
        `${className.colors} ${inClass} flex h-8 gap-2 items-center justify-between rounded-sm px-4 text-sm`,
      )}
    >
      {disabled ? <ClipLoader size={20} color="white" className="shrink-0" /> : null}
      <button
        disabled={disabled}
        className="w-full disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      ></button>
    </div>
  );
}

export default Button;
