import { cn, formatDueDate } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import type { Task } from "@/types/task";
import { CalendarIcon, Trash2 } from "lucide-react";
import { isBefore, startOfDay } from "date-fns";
import { FreshDate } from "./fresh-date";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogAction,
} from "./ui/alert-dialog";

const TaskItem = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  onEditClick,
}: {
  task: Task;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: () => void;
  onEditClick: () => void;
}) => {
  const dueDate = task.dueDate;
  return (
    <div
      className="pt-2 pb-3 flex gap-2 group w-full cursor-pointer"
      data-testid="task-list-item"
      role="button"
      onClick={() => {
        onEditClick();
      }}
    >
      <Checkbox
        className="mt-1"
        checked={task.status === "done"}
        onCheckedChange={(checked) => {
          onTaskUpdate({ ...task, status: checked ? "done" : "todo" });
        }}
        onClick={(e) => {
          // Prevent click from propagating to the parent div
          e.stopPropagation();
        }}
        aria-label="Mark as completed"
      />
      <div className="flex gap-2 flex-1">
        <div className="flex flex-1 flex-col gap-2">
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
        <AlertDialog>
          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete task"
              className="-mt-1 invisible group-hover:visible transition-none"
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task?</AlertDialogTitle>
              <AlertDialogDescription>
                This Task will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onTaskDelete();
                }}
                asChild
              >
                <Button variant="destructive">Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export { TaskItem };
