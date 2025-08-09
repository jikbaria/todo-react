import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import type { Task } from "./types/task";
import { createTask } from "./test/utils";

describe("App", () => {
  it("renders main layout", async () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: /my tasks/i })
    ).toBeInTheDocument();
  });

  const KEY = "todo.tasks.v1";

  const seedLocal = (tasks: Task[]) => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
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
});
