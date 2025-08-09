import type { Task, TaskDraft } from "../types/task";
import type { TaskService } from "./task-service";

export const STORAGE_KEY = "todo.tasks.v1";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class LocalTaskService implements TaskService {
  private load(): Task[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
  private save(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
  async list() {
    await sleep(500);
    return {
      tasks: this.load(),
    };
  }

  async create(draft: TaskDraft) {
    await sleep(500);
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...draft,
    };
    const tasks = this.load();
    tasks.unshift(task);
    this.save(tasks);
    return task;
  }
  async update(id: string, update: Partial<TaskDraft>) {
    await sleep(500);
    const tasks = this.load();
    const i = tasks.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Not found");
    tasks[i] = { ...tasks[i], ...update, updatedAt: new Date().toISOString() };
    this.save(tasks);
    return tasks[i];
  }
  async delete(id: string) {
    await sleep(500);
    this.save(this.load().filter((t) => t.id !== id));
  }
}
