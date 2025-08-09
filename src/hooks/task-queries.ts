import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Task, TaskDraft } from "@/types/task";
import { LocalTaskService } from "../services/local-storage-service";

// Local storage backed service instance
const taskService = new LocalTaskService();

const taskQueryOptions = () =>
  queryOptions({
    queryKey: ["tasks"],
    queryFn: async () => {
      const list = await taskService.list();
      return list;
    },
  });

const baseMutationOptions = {
  scope: {
    // Ensures all mutations for "tasks" are executed sequentially,
    // which is required for reliable optimistic updates and to prevent race conditions.
    id: "tasks",
  },
};
export function useTasksQuery() {
  return useSuspenseQuery(taskQueryOptions());
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    ...baseMutationOptions,
    mutationFn: (draft: TaskDraft) => taskService.create(draft),
    // Optimistic update
    onMutate: async (draft) => {
      await queryClient.cancelQueries(taskQueryOptions());

      const optimisticTask: Task = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...draft,
      };

      queryClient.setQueryData(taskQueryOptions().queryKey, (old) => {
        const tasks = old?.tasks || [];
        return {
          ...old,
          tasks: [optimisticTask, ...tasks],
        };
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    ...baseMutationOptions,
    mutationFn: async (args: { id: string; update: Partial<TaskDraft> }) =>
      taskService.update(args.id, args.update),
    onMutate: async ({ id, update }) => {
      await queryClient.cancelQueries(taskQueryOptions());

      queryClient.setQueryData(taskQueryOptions().queryKey, (old) => {
        const tasks = old?.tasks || [];
        return {
          ...old,
          tasks: tasks.map((t) =>
            t.id === id
              ? { ...t, ...update, updatedAt: new Date().toISOString() }
              : t
          ),
        };
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    ...baseMutationOptions,
    mutationFn: async (id: string) => taskService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries(taskQueryOptions());
      queryClient.setQueryData(taskQueryOptions().queryKey, (old) => {
        const tasks = old?.tasks || [];
        return {
          ...old,
          tasks: tasks.filter((t) => t.id !== id),
        };
      });
    },
  });
}
