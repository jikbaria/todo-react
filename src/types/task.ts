export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type TaskDraft = Omit<Task, "id" | "createdAt" | "updatedAt">;
