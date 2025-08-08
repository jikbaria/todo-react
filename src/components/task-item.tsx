import type { Task } from "@/types/task";

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <div className="py-2">
      <div className="text-lg font-semibold">{task.title}</div>
      <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
        {task.description}
      </div>
    </div>
  );
};

export { TaskItem };
