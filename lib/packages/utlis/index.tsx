import { ClassNameValue, twMerge } from "tailwind-merge";

export function clsx(...classList: ClassNameValue[]) {
  return twMerge(classList);
}
