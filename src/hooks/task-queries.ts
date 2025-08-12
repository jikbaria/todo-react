import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Task, TaskDraft } from "@/types/task";
import { APITaskService } from "@/services/api-service";

/* 
Overview:
- Optimistic CRUD with React Query.
- Create inserts a task with a local UUID immediately.
- Update/Delete may receive a local id (from an optimistic create) or a real server id.
- getTaskRemoteId maps a possibly-local id to the real server id by inspecting the successful
  "tasks/create" mutation whose context contains the local id; if no match, the id is already real.
- Before each optimistic onMutate, cancel any in-flight ["tasks"] fetch so it can't write stale data over our optimistic update.
- Mutations run sequentially via scope. After the last mutation settles, invalidate ["tasks"] to refetch and reconcile with server truth.
*/

// Local storage backed service instance
const taskService = new APITaskService();

const taskQueryOptions = () =>
  queryOptions({
    queryKey: ["tasks"],
    queryFn: async () => {
      const list = await taskService.list();
      return list;
    },
  });

const baseMutationOptions = {
  mutationKey: ["tasks"],
  scope: {
    // Ensures all mutations for "tasks" are executed sequentially,
    id: "tasks",
  },
};

const onMutationSettled = (queryClient: QueryClient) => {
  if (
    queryClient.isMutating({
      mutationKey: baseMutationOptions.mutationKey,
    }) === 1
  ) {
    queryClient.invalidateQueries(taskQueryOptions());
  }
};

type CreateTaskData = Task;
type CreateTaskContext = {
  localTaskId: string;
};

const getTaskRemoteId = (queryClient: QueryClient, id: string) => {
  const createMutation = queryClient
    .getMutationCache()
    .find<CreateTaskData, unknown, unknown, CreateTaskContext>({
      mutationKey: [...baseMutationOptions.mutationKey, "create"],
      status: "success",
      predicate: (m) => {
        const context = m.state.context as CreateTaskContext;
        return id === context.localTaskId;
      },
    });

  if (createMutation) {
    const data = createMutation.state.data!;
    return data.id;
  }

  return id;
};

export function useTasksQuery() {
  return useSuspenseQuery(taskQueryOptions());
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation<CreateTaskData, Error, TaskDraft, CreateTaskContext>({
    ...baseMutationOptions,
    mutationKey: [...baseMutationOptions.mutationKey, "create"],
    mutationFn: (draft: TaskDraft) => taskService.create(draft),
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
      return {
        localTaskId: optimisticTask.id,
      };
    },
    onSettled: () => {
      onMutationSettled(queryClient);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    ...baseMutationOptions,
    mutationKey: [...baseMutationOptions.mutationKey, "update"],
    mutationFn: async (args: { id: string; update: TaskDraft }) => {
      const remoteId = getTaskRemoteId(queryClient, args.id);

      return taskService.update(remoteId, args.update);
    },
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
    onSettled: () => {
      onMutationSettled(queryClient);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    ...baseMutationOptions,
    mutationFn: async (id: string) => {
      const remoteId = getTaskRemoteId(queryClient, id);
      return taskService.delete(remoteId);
    },
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
    onSettled: () => {
      onMutationSettled(queryClient);
    },
  });
}
