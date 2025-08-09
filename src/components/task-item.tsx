import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import type { Task } from "@/types/task";

const TaskItem = ({
  task,
  onTaskUpdate,
}: {
  task: Task;
  onTaskUpdate: (task: Task) => void;
}) => {
  return (
    <div className="py-2 flex gap-2">
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
        <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
          {task.description}
        </div>
      </div>
    </div>
  );
};

export { TaskItem };
