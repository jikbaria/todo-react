import { TaskItem } from "./task-item";
import type { Task } from "@/types/task";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronRight } from "lucide-react";

const TaskList = ({
  tasks,
  onTaskUpdate,
}: {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}) => {
  const pendingTasks = tasks.filter((task) => task.status === "todo");
  const completedTasks = tasks.filter((task) => task.status === "done");
  return (
    <div>
      <div className="flex flex-col *:border-b">
        {pendingTasks.map((task) => (
          <TaskItem key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
        ))}
      </div>
      {completedTasks.length > 0 && (
        <Collapsible className="flex flex-col gap-2 mt-2">
          <CollapsibleTrigger className="flex group items-center gap-2">
            <ChevronRight className="size-5 group-data-[state=open]:rotate-90" />
            <h4 className="text-base font-semibold">Completed Tasks</h4>
          </CollapsibleTrigger>

          <CollapsibleContent className="flex flex-col *:border-b">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export { TaskList };
