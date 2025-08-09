import { TaskItem } from "./task-item";
import type { Task } from "@/types/task";

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="flex flex-col divide-y">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export { TaskList };
