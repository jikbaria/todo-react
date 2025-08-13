import { API_BASE_URL } from "@/config";
import type { Task, TaskDraft } from "../types/task";
import type { TaskService } from "./task-service";

export class APITaskService implements TaskService {
  async list() {
    const res = await fetch(`${API_BASE_URL}/todos`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const tasks: Task[] = await res.json();
    return { tasks };
  }

  async create(draft: TaskDraft): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return await res.json();
  }

  async update(id: string, update: TaskDraft) {
    const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return await res.json();
  }

  async delete(id: string) {
    const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
  }
}
