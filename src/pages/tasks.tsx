import { TaskEditor } from "@/components/task-editor";
import { TaskList } from "@/components/task-list";
import { useCreateTask, useTasksQuery } from "@/hooks/task-queries";

const TasksPage = () => {
  const createTask = useCreateTask();
  const { data } = useTasksQuery();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-extrabold">My Tasks</h1>
      <TaskEditor onSubmit={createTask.mutate} />
      <TaskList tasks={data.tasks} />
    </div>
  );
};

export { TasksPage };
