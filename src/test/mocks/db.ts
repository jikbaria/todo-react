// Lightweight in-memory DB for tests; reset between tests to keep isolation.

import type { Task, TaskDraft } from "@/types/task";

let state: { tasks: Task[] } = { tasks: [] };

export function resetDb() {
  state = { tasks: [] };
}

export function seedTasks(tasks: Task[]) {
  state.tasks = tasks;
}

export function getTasks() {
  return state.tasks;
}

export function addTask(task: TaskDraft) {
  state.tasks.push({
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return task;
}

export function updateTask(id: string, patch: TaskDraft) {
  const idx = state.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  state.tasks[idx] = { ...state.tasks[idx], ...patch };
  return state.tasks[idx];
}

export function deleteTask(id: string) {
  const prevLen = state.tasks.length;
  state.tasks = state.tasks.filter((t) => t.id !== id);
  return state.tasks.length < prevLen;
}
