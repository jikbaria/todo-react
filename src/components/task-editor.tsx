import { useRef } from "react";
import { Button } from "./ui/button";
import type { TaskDraft } from "@/types/task";

const TaskEditor = ({ onSubmit }: { onSubmit: (draft: TaskDraft) => void }) => {
  const titleRef = useRef<HTMLTextAreaElement>(null!);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const draft: TaskDraft = {
      title,
      description: description ?? "",
      status: "todo",
      dueDate: null,
    };

    onSubmit(draft);

    // clear the form
    form.reset();
    titleRef.current.focus();
  };
  const autoResize = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = "auto"; // Reset height to recalculate
    textarea.style.height = textarea.scrollHeight + "px";
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-md border border-gray-300 p-3 focus-within:border-gray-400"
    >
      <div className="flex flex-col">
        <textarea
          name="title"
          rows={1}
          aria-label="Title"
          required
          ref={titleRef}
          onInput={autoResize}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // trigger the submit event using form element
              const form = e.currentTarget.form;
              if (form) {
                form.requestSubmit();
              }
            }
          }}
          minLength={10}
          maxLength={1024}
          placeholder="Title"
          className="resize-none text-base font-semibold text-primary outline-none placeholder:text-muted-foreground"
        />
        <textarea
          onInput={autoResize}
          name="description"
          rows={1}
          aria-label="Description"
          placeholder="Description"
          className="resize-none text-base text-primary outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
};

export { TaskEditor };
