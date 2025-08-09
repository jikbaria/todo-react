import { render, screen } from "@testing-library/react";
import { TaskList } from "./task-list";
import type { Task } from "@/types/task";

const iso = new Date().toISOString();

describe("TaskList", () => {
  it("renders a list of tasks", () => {
    const tasks: Task[] = [
      {
        id: "t-1",
        title: "Task A",
        description: "First",
        status: "todo" as const,
        dueDate: null,
        createdAt: iso,
        updatedAt: iso,
      },
      {
        id: "t-2",
        title: "Task B",
        description: "Second",
        status: "done" as const,
        dueDate: null,
        createdAt: iso,
        updatedAt: iso,
      },
    ];

    render(<TaskList tasks={tasks} />);

    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });
});
