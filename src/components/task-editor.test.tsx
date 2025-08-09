import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskEditor } from "./task-editor";
import { vi } from "vitest";

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
});
