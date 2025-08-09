import {
  format as formatDate,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDueDate = (date: string | null) => {
  if (!date) return "Due Date";

  if (isYesterday(date)) return "Yesterday";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isThisYear(date)) {
    return formatDate(date, "ccc d MMM");
  }

  return formatDate(date, "ccc d MMM yyyy");
};
