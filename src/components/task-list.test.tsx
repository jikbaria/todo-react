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
      <TaskList
        tasks={tasks}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
        editingTaskId={null}
      />
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
        onEditClick={() => {}}
        editingTaskId={null}
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
        onEditClick={() => {}}
        editingTaskId={null}
      />
    );

    const user = userEvent.setup();

    // Open delete dialog within the row containing "Remove me"
    const item = screen.getByRole("button", {
      name: /Remove me/i,
    });

    await user.click(
      within(item!).getByRole("button", { name: /delete task/i, hidden: true })
    );

    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /delete/i }));

    expect(onTaskDelete).toHaveBeenCalledWith("t-1");
  });

  it("enters edit mode when a task is clicked and saves changes", async () => {
    const tasks: Task[] = [
      createTask({ id: "e-1", title: "Editable", description: "Old" }),
    ];

    const onTaskUpdate = vi.fn();
    const onEditClick = vi.fn();
    const { rerender } = render(
      <TaskList
        tasks={tasks}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={() => {}}
        onEditClick={onEditClick}
        editingTaskId={null}
      />
    );

    const user = userEvent.setup();

    // click row to start editing
    await user.click(screen.getByRole("button", { name: /editable/i }));
    expect(onEditClick).toHaveBeenCalledWith("e-1");

    // Simulate parent setting editingTaskId
    rerender(
      <TaskList
        tasks={tasks}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={() => {}}
        onEditClick={onEditClick}
        editingTaskId={"e-1"}
      />
    );

    // Editor should be visible with Save button
    const saveBtn = screen.getByRole("button", { name: /save/i });
    const title = screen.getByLabelText(/title/i);
    const desc = screen.getByLabelText(/description/i);
    await user.clear(title);
    await user.type(title, "Edited Title 123456");
    await user.clear(desc);
    await user.type(desc, "Edited Description");
    await user.click(saveBtn);

    expect(onTaskUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "e-1",
        title: "Edited Title 123456",
        description: "Edited Description",
      })
    );
  });

  it("cancels edit mode without saving when Cancel is clicked", async () => {
    const tasks: Task[] = [
      createTask({ id: "e-2", title: "Cancelable", description: "Old" }),
    ];

    const onTaskUpdate = vi.fn();
    const onEditClick = vi.fn();
    render(
      <TaskList
        tasks={tasks}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={() => {}}
        onEditClick={onEditClick}
        editingTaskId={"e-2"}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onTaskUpdate).not.toHaveBeenCalled();
    // parent should set editingTaskId to null
    expect(onEditClick).toHaveBeenCalledWith(null);
  });
});
