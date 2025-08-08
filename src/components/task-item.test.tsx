import { render, screen } from "@testing-library/react";
import { TaskItem } from "./task-item";
import type { Task } from "@/types/task";

const iso = new Date().toISOString();

describe("TaskItem", () => {
  it("renders title and description", () => {
    const task: Task = {
      id: "t-1",
      title: "Write unit tests",
      description: "Cover components and hooks",
      status: "todo" as const,
      dueDate: null,
      createdAt: iso,
      updatedAt: iso,
    };

    render(<TaskItem task={task} />);

    expect(screen.getByText("Write unit tests")).toBeInTheDocument();
    expect(screen.getByText("Cover components and hooks")).toBeInTheDocument();
  });
});
