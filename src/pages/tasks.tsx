import { TaskEditor } from "@/components/task-editor";
import { TaskList } from "@/components/task-list";
import {
  useCreateTask,
  useDeleteTask,
  useTasksQuery,
  useUpdateTask,
} from "@/hooks/task-queries";
import { useState } from "react";

const TasksPage = () => {
  const createTask = useCreateTask();
  const { data } = useTasksQuery();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editingTaskId, setEditingTaskId] = useState<null | string>(null);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-extrabold">My Tasks</h1>
      {editingTaskId === null && <TaskEditor onSubmit={createTask.mutate} />}
      <TaskList
        tasks={data.tasks}
        onTaskUpdate={(task) =>
          updateTask.mutate({ id: task.id, update: task })
        }
        onTaskDelete={(taskId) => {
          deleteTask.mutate(taskId);
        }}
        onEditClick={(taskId) => {
          setEditingTaskId(taskId);
        }}
        editingTaskId={editingTaskId}
      />
    </div>
  );
};

export { TasksPage };
