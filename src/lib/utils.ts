import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortOptions = {
  amountAsc: "amount-asc",
  amountDesc: "amount-desc",
  dateAsc: "date-asc",
  dateDesc: "date-desc",
} as const;
