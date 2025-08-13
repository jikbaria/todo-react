import { http, HttpResponse } from "msw";
import { addTask, deleteTask, getTasks, updateTask } from "./db";
import type { TaskDraft } from "@/types/task";
import { API_BASE_URL } from "@/config";

export const handlers = [
  http.get(`${API_BASE_URL}/todos`, () => {
    return HttpResponse.json(getTasks(), { status: 200 });
  }),

  http.post(`${API_BASE_URL}/todos`, async ({ request }) => {
    const body = (await request.json()) as TaskDraft;
    const created = addTask(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/todos/:id`, async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as TaskDraft;
    const updated = updateTask(id, body);
    if (!updated) {
      return HttpResponse.json({ message: "not found" }, { status: 404 });
    }
    return HttpResponse.json(updated, { status: 200 });
  }),

  http.delete(`${API_BASE_URL}/todos/:id`, ({ params }) => {
    const id = String(params.id);
    const ok = deleteTask(id);
    if (!ok) {
      return HttpResponse.json({ message: "not found" }, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
