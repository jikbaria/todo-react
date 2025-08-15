import {
  format as formatDate,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
} from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDueDateDisplay = (dateString: string | null) => {
  if (!dateString) return "Due Date";

  const date = parsedDueDateData(dateString);

  if (isYesterday(date)) return "Yesterday";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isThisYear(date)) {
    return formatDate(date, "ccc d MMM");
  }

  return formatDate(date, "ccc d MMM yyyy");
};

export const formatDueDateData = (date: Date) => {
  return formatDate(date, "yyyy-MM-dd") + "T00:00:00";
};
export const parsedDueDateData = (date: string) => {
  const parsedDate = parseISO(date);
  return parsedDate;
};
