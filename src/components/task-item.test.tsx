import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "./task-item";
import type { Task } from "@/types/task";
import { createTask } from "@/test/utils";
import { formatDueDateData, formatDueDateDisplay } from "@/lib/utils";
import { vi } from "vitest";
import { addDays, startOfDay, subDays } from "date-fns";

describe("TaskItem", () => {
  it("renders title and description", () => {
    const task = createTask({
      title: "Write unit tests",
      description: "Cover components and hooks",
    });

    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByText(task.description)).toBeInTheDocument();
  });

  it("calls onTaskUpdate with status 'done' when checkbox is checked", async () => {
    const task = createTask({
      title: "Toggle me",
      description: "Click the checkbox",
    });

    const onTaskUpdate = vi.fn();
    render(
      <TaskItem
        task={task}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

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

    render(
      <TaskItem
        task={doneTask}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

    expect(
      screen.getByRole("checkbox", { name: /mark as completed/i })
    ).toBeChecked();
  });

  it("calls onTaskUpdate with status 'todo' when unchecked", async () => {
    const task: Task = createTask({
      status: "done",
    });

    const onTaskUpdate = vi.fn();
    render(
      <TaskItem
        task={task}
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

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

  it("renders formatted due date text when dueDate is present", () => {
    const baseNow = new Date();

    const futureDate = addDays(startOfDay(baseNow), 6);

    const dueDate = formatDueDateData(futureDate);
    const task = createTask({ dueDate, title: "Has due date" });

    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

    const expectedLabel = formatDueDateDisplay(dueDate);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it("marks task as overdue when due date is in the past", () => {
    const baseNow = new Date();

    const pastDue = formatDueDateData(subDays(startOfDay(baseNow), 1));
    const task = createTask({ dueDate: pastDue, title: "Overdue task" });

    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

    const label = screen.getByText(formatDueDateDisplay(pastDue));
    expect(label).toHaveAttribute("data-overdue", "true");
  });

  it("does not mark task as overdue for today or future dates", () => {
    const baseNow = new Date();

    const futureDue = formatDueDateData(addDays(startOfDay(baseNow), 30));
    const task = createTask({ dueDate: futureDue, title: "Future task" });

    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={() => {}}
      />
    );

    const label = screen.getByText(formatDueDateDisplay(futureDue));
    expect(label).toHaveAttribute("data-overdue", "false");
  });

  it("opens delete confirmation and calls onTaskDelete on confirm", async () => {
    const task = createTask({ title: "Delete me" });

    const onTaskDelete = vi.fn();
    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={onTaskDelete}
        onEditClick={() => {}}
      />
    );

    const user = userEvent.setup();

    // Open dialog via the trash trigger button
    await user.click(
      screen.getByRole("button", {
        name: /delete task/i,
        hidden: true,
      })
    );

    // Confirm deletion
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /delete/i }));

    expect(onTaskDelete).toHaveBeenCalledTimes(1);
  });

  it("does not delete when canceled", async () => {
    const task = createTask({ title: "Keep me" });

    const onTaskDelete = vi.fn();
    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={onTaskDelete}
        onEditClick={() => {}}
      />
    );

    const user = userEvent.setup();

    // Open dialog via the trash trigger button
    await user.click(
      screen.getByRole("button", {
        name: /delete/i,
        hidden: true,
      })
    );
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /cancel/i }));

    expect(onTaskDelete).not.toHaveBeenCalled();
  });

  it("calls onEditClick when the row is clicked", async () => {
    const task = createTask({ title: "Click to edit 123456" });
    const onEditClick = vi.fn();

    render(
      <TaskItem
        task={task}
        onTaskUpdate={() => {}}
        onTaskDelete={() => {}}
        onEditClick={onEditClick}
      />
    );

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /click to edit 123456/i })
    );

    expect(onEditClick).toHaveBeenCalledTimes(1);
  });
});
