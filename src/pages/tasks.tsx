import { TaskEditor } from "@/components/task-editor";
import { TaskList } from "@/components/task-list";
import {
  useCreateTask,
  useTasksQuery,
  useUpdateTask,
} from "@/hooks/task-queries";

const TasksPage = () => {
  const createTask = useCreateTask();
  const { data } = useTasksQuery();
  const updateTask = useUpdateTask();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-extrabold">My Tasks</h1>
      <TaskEditor onSubmit={createTask.mutate} />
      <TaskList
        tasks={data.tasks}
        onTaskUpdate={(task) =>
          updateTask.mutate({ id: task.id, update: task })
        }
      />
    </div>
  );
};

export { TasksPage };
