import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import type { Task } from "./types/task";

it("renders the app", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
});

const KEY = "todo.tasks.v1";

const seedLocal = (tasks: Task[]) => {
  localStorage.setItem(KEY, JSON.stringify(tasks));
};

const makeTask = (overrides: Partial<Task> = {}) => ({
  id: "seed-1",
  title: "Seeded task",
  description: "Already there",
  status: "todo" as const,
  dueDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

it("loads tasks and allows adding a new task (optimistic)", async () => {
  seedLocal([makeTask()]);

  render(<App />);

  expect(
    await screen.findByRole("heading", { name: /my tasks/i })
  ).toBeInTheDocument();
  expect(screen.getByText("Seeded task")).toBeInTheDocument();

  const title = screen.getByLabelText("Title");
  const description = screen.getByLabelText("Description");
  await userEvent.type(title, "New task 1234");
  await userEvent.type(description, "Do something");

  await userEvent.click(screen.getByRole("button", { name: /add/i }));

  expect(screen.getByText("New task 1234")).toBeInTheDocument();
});
