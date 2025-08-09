import { render, screen, within } from "@testing-library/react";
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
    render(
      <TaskList tasks={tasks} onTaskUpdate={() => {}} onTaskDelete={() => {}} />
    );

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
    render(
      <TaskList
        tasks={tasks}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={() => {}}
      />
    );

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

  it("call delete task", async () => {
    const tasks: Task[] = [
      createTask({ id: "t-1", title: "Remove me", status: "todo" }),
      createTask({ id: "t-2", title: "B", status: "todo" }),
    ];
    const onTaskDelete = vi.fn();
    render(
      <TaskList
        tasks={tasks}
        onTaskUpdate={() => {}}
        onTaskDelete={onTaskDelete}
      />
    );

    const user = userEvent.setup();

    // Open delete dialog within the row containing "Remove me"
    const item = screen
      .getAllByTestId("task-list-item")
      .find((el) => within(el).queryByText("Remove me"));
    await user.click(
      within(item!).getByRole("button", { name: /delete task/i, hidden: true })
    );

    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /delete/i }));

    expect(onTaskDelete).toHaveBeenCalledWith("t-1");
  });
});
