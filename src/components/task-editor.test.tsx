import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskEditor } from "./task-editor";
import { vi } from "vitest";
import { addDays, format, startOfDay } from "date-fns";

describe("TaskEditor", () => {
  it("renders inputs and submit button", () => {
    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("submits valid input and resets form and focus title", async () => {
    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    const user = userEvent.setup();

    const title = screen.getByLabelText("Title");
    const description = screen.getByLabelText("Description");

    await user.type(title, "New task 1234");
    await user.type(description, "Do something important");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New task 1234",
        description: "Do something important",
        status: "todo",
      })
    );

    expect(title).toHaveValue("");
    expect(title).toHaveFocus();
    expect(description).toHaveValue("");
  });

  it("submits when pressing Enter in title field", async () => {
    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    const user = userEvent.setup();

    const title = screen.getByLabelText("Title");
    await user.type(title, "Long enough title 1234{enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Long enough title 1234",
        description: "",
        status: "todo",
      })
    );
  });

  it("allows picking a due date and submits it", async () => {
    const baseNow = new Date("2025-08-09T12:00:00.000Z");
    vi.setSystemTime(baseNow);

    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    const user = userEvent.setup();

    // Open the due date picker
    const openBtn = screen.getByRole("button", { name: /set due date/i });
    await user.click(openBtn);

    // Pick a future date: 6 days from today
    const target = addDays(startOfDay(baseNow), 6);
    const dialog = await screen.findByRole("dialog");
    const dayEl = within(dialog).getByText(String(target.getDate()));

    await user.click(dayEl.closest("button")!);

    // Fill title and submit
    await user.type(screen.getByLabelText("Title"), "Task with due date 1234");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.title).toBe("Task with due date 1234");
    expect(submitted.status).toBe("todo");
    // ensure it parses to the selected day
    const submittedDate = new Date(submitted.dueDate);
    expect(format(submittedDate, "yyyy-MM-dd")).toBe(
      format(target, "yyyy-MM-dd")
    );
  });

  it("shows default values and Cancel/Save in edit variant", async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <TaskEditor
        variant="edit"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ title: "Existing title 123456", description: "Desc" }}
      />
    );

    expect(
      screen.getByDisplayValue(/existing title 123456/i)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(/desc/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onCancel in edit variant", async () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <TaskEditor
        variant="edit"
        onSubmit={onSubmit}
        onCancel={onCancel}
        defaultValues={{ title: "Cancelable 123456" }}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
