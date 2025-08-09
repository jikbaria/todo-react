import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskEditor } from "./task-editor";

describe("TaskEditor", () => {
  it("renders inputs and submit button", () => {
    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("submits a valid draft, then clears and focuses the title field", async () => {
    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    const title = screen.getByLabelText("Title");
    const description = screen.getByLabelText("Description");

    await userEvent.type(title, "New task 1234");
    await userEvent.type(description, "Do something important");

    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: "New task 1234",
      description: "Do something important",
      status: "todo",
      dueDate: null,
    });

    // After submit, form resets and title is focused
    expect(title).toHaveValue("");
    expect(title).toHaveFocus();
    expect(description).toHaveValue("");
  });

  it("triggers submit when pressing Enter in the title field", async () => {
    const onSubmit = vi.fn();
    render(<TaskEditor onSubmit={onSubmit} />);

    const title = screen.getByLabelText("Title");
    await userEvent.type(title, "Long enough title 1234{enter}");

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Long enough title 1234",
      description: "",
      status: "todo",
      dueDate: null,
    });
  });
});
