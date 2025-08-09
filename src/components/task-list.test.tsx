import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "./task-list";
import type { Task } from "@/types/task";
import { vi } from "vitest";
import { createTask } from "@/test/utils";

describe("TaskList", () => {
  it("renders a list of tasks", () => {
    const tasks: Task[] = [
      createTask({
        title: "Task A",
        description: "First",
        status: "todo",
      }),
      createTask({
        title: "Task B",
        description: "Second",
        status: "todo",
      }),
    ];

    render(<TaskList tasks={tasks} onTaskUpdate={() => {}} />);

    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  it("splits tasks into pending and completed, and toggles status", async () => {
    const tasks: Task[] = [
      createTask({
        title: "Pending A",
        description: "First",
        status: "todo",
      }),
      createTask({
        title: "Completed B",
        description: "Second",
        status: "done",
      }),
    ];

    const onTaskUpdate = vi.fn();
    render(<TaskList tasks={tasks} onTaskUpdate={onTaskUpdate} />);

    const user = userEvent.setup();

    expect(screen.getByText("Pending A")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /completed tasks/i }));

    expect(screen.getByText("Completed B")).toBeInTheDocument();

    const checkbox = screen.getAllByRole("checkbox", {
      name: /mark as completed/i,
    })[0];
    await user.click(checkbox);
    expect(onTaskUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: tasks[0].id,
        status: "done",
      })
    );
  });
});
