import { cn, formatDueDate } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import type { Task } from "@/types/task";
import { CalendarIcon } from "lucide-react";
import { isBefore, startOfDay } from "date-fns";
import { FreshDate } from "./fresh-date";

const TaskItem = ({
  task,
  onTaskUpdate,
}: {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}) => {
  const dueDate = task.dueDate;
  return (
    <div className="pt-2 pb-3 flex gap-2">
      <Checkbox
        className="mt-1"
        checked={task.status === "done"}
        onCheckedChange={(checked) =>
          onTaskUpdate({ ...task, status: checked ? "done" : "todo" })
        }
        aria-label="Mark as completed"
      />
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "text-lg font-semibold",
            task.status === "done" && "line-through"
          )}
        >
          {task.title}
        </div>
        {!!task.description && (
          <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {task.description}
          </div>
        )}
        {dueDate && (
          <FreshDate>
            {() => (
              <div
                className={cn(
                  "text-xs text-gray-500 flex gap-1 items-center",
                  isBefore(startOfDay(dueDate), startOfDay(new Date())) &&
                    "text-red-500"
                )}
                data-overdue={
                  isBefore(startOfDay(dueDate), startOfDay(new Date()))
                    ? "true"
                    : "false"
                }
              >
                <CalendarIcon className="size-3" />
                {formatDueDate(dueDate)}
              </div>
            )}
          </FreshDate>
        )}
      </div>
    </div>
  );
};

export { TaskItem };
