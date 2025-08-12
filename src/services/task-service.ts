import type { Task, TaskDraft } from "../types/task";

export interface TaskService {
  list(): Promise<{
    tasks: Task[];
  }>;
  create(draft: TaskDraft): Promise<Task>;
  update(id: string, update: TaskDraft): Promise<Task>;
  delete(id: string): Promise<void>;
}
