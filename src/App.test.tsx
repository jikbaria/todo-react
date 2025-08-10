import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import type { Task } from "./types/task";
import { createTask } from "./test/utils";
import { formatDueDate } from "./lib/utils";
import { addDays, startOfDay, subDays } from "date-fns";
import { STORAGE_KEY } from "./services/local-storage-service";

describe("App", () => {
  it("renders main layout", async () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: /my tasks/i })
    ).toBeInTheDocument();
  });

  const seedLocal = (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  };

  it("loads persisted tasks and adds a task optimistically", async () => {
    seedLocal([
      createTask({
        title: "Seeded task",
      }),
    ]);

    render(<App />);

    const user = userEvent.setup();

    expect(
      await screen.findByRole("heading", { name: /my tasks/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Seeded task")).toBeInTheDocument();

    const title = screen.getByLabelText("Title");
    const description = screen.getByLabelText("Description");

    await user.type(title, "New task 1234");
    await user.type(description, "Do something");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("New task 1234")).toBeInTheDocument();
  });

  it("completes a task and shows it under Completed Tasks", async () => {
    const seeded = createTask({
      id: "seed-2",
      title: "Finish docs",
    });
    seedLocal([seeded]);

    render(<App />);

    const user = userEvent.setup();

    await screen.findByRole("heading", { name: /my tasks/i });

    expect(screen.getByText("Finish docs")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", {
      name: /mark as completed/i,
    });
    await user.click(checkbox);

    // Now the task moves to the Completed Tasks section
    await user.click(screen.getByRole("button", { name: /completed tasks/i }));

    expect(screen.getByText("Finish docs")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /mark as completed/i })
    ).toBeChecked();
  });

  it("shows due date for tasks and marks overdue ones", async () => {
    const baseNow = new Date();

    const overdue = createTask({
      title: "Overdue",
      dueDate: subDays(startOfDay(baseNow), 3).toISOString(),
    });
    const future = createTask({
      title: "Future",
      dueDate: addDays(startOfDay(baseNow), 21).toISOString(),
    });
    seedLocal([overdue, future]);

    render(<App />);

    // Wait for app
    await screen.findByRole("heading", { name: /my tasks/i });

    // Overdue
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    const overdueLabel = screen.getByText(formatDueDate(overdue.dueDate!));
    expect(overdueLabel).toHaveAttribute("data-overdue", "true");

    // Future
    expect(screen.getByText("Future")).toBeInTheDocument();
    const futureLabel = screen.getByText(formatDueDate(future.dueDate!));
    expect(futureLabel).toHaveAttribute("data-overdue", "false");
  });

  it("deletes a task", async () => {
    const toDelete = createTask({ id: "del-1", title: "Remove me" });
    const toKeep = createTask({ id: "keep-1", title: "Keep me" });
    seedLocal([toDelete, toKeep]);

    render(<App />);

    await screen.findByRole("heading", { name: /my tasks/i });

    expect(screen.getByText("Remove me")).toBeInTheDocument();
    expect(screen.getByText("Keep me")).toBeInTheDocument();

    const user = userEvent.setup();

    // Open delete dialog within the row containing "Remove me"
    const item = screen.getByRole("button", {
      name: /Remove me/i,
    });

    await user.click(
      within(item).getByRole("button", { name: /delete task/i, hidden: true })
    );

    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /delete/i }));

    expect(screen.queryByText("Remove me")).not.toBeInTheDocument();
    expect(screen.getByText("Keep me")).toBeInTheDocument();
  });

  it("enters edit mode when clicking a task and hides the add editor", async () => {
    const t = createTask({ id: "e-11", title: "Click me to edit" });
    seedLocal([t]);

    render(<App />);
    await screen.findByRole("heading", { name: /my tasks/i });

    const user = userEvent.setup();
    // Add editor is shown initially
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();

    // Click the row to edit
    await user.click(screen.getByRole("button", { name: /click me to edit/i }));

    // Now the inline editor appears and the top add editor hides
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add/i })
    ).not.toBeInTheDocument();
  });

  it("saves edits and exits edit mode", async () => {
    const t = createTask({ id: "e-12", title: "Old title 123456" });
    seedLocal([t]);

    render(<App />);
    await screen.findByRole("heading", { name: /my tasks/i });
    const user = userEvent.setup();

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: /old title 123456/i }));
    const title = screen.getByLabelText(/title/i);
    await user.clear(title);
    await user.type(title, "New edited title 123456");
    await user.click(screen.getByRole("button", { name: /save/i }));

    // Back to list item view with updated title
    expect(
      await screen.findByText(/new edited title 123456/i)
    ).toBeInTheDocument();
    // Add editor visible again
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("cancels edit and restores view without changing", async () => {
    const t = createTask({ id: "e-13", title: "Stay same 123456" });
    seedLocal([t]);

    render(<App />);
    await screen.findByRole("heading", { name: /my tasks/i });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /stay same 123456/i }));
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Should render item again with original title
    expect(
      screen.getByRole("button", { name: /stay same 123456/i })
    ).toBeInTheDocument();
    // Add editor visible again
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });
});
