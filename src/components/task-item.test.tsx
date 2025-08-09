import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "./task-item";
import type { Task } from "@/types/task";
import { createTask } from "@/test/utils";

describe("TaskItem", () => {
  it("renders title and description", () => {
    const task = createTask({
      title: "Write unit tests",
      description: "Cover components and hooks",
    });

    render(<TaskItem task={task} onTaskUpdate={() => {}} />);

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByText(task.description)).toBeInTheDocument();
  });

  it("calls onTaskUpdate with status 'done' when checkbox is checked", async () => {
    const task = createTask({
      title: "Toggle me",
      description: "Click the checkbox",
    });

    const onTaskUpdate = vi.fn();
    render(<TaskItem task={task} onTaskUpdate={onTaskUpdate} />);

    const user = userEvent.setup();

    const checkbox = screen.getByRole("checkbox", {
      name: /mark as completed/i,
    });
    await user.click(checkbox);

    expect(onTaskUpdate).toHaveBeenCalledTimes(1);
    expect(onTaskUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: task.id,
        status: "done",
      })
    );
  });

  it("shows checkbox checked when task status is 'done'", () => {
    const doneTask: Task = createTask({
      status: "done",
    });

    render(<TaskItem task={doneTask} onTaskUpdate={() => {}} />);

    expect(
      screen.getByRole("checkbox", { name: /mark as completed/i })
    ).toBeChecked();
  });

  it("calls onTaskUpdate with status 'todo' when unchecked", async () => {
    const task: Task = createTask({
      status: "done",
    });

    const onTaskUpdate = vi.fn();
    render(<TaskItem task={task} onTaskUpdate={onTaskUpdate} />);

    const user = userEvent.setup();

    const checkbox = screen.getByRole("checkbox", {
      name: /mark as completed/i,
    });
    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    expect(onTaskUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ id: task.id, status: "todo" })
    );
  });
});
