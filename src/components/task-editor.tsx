import { useRef, useState } from "react";
import { Button } from "./ui/button";
import type { TaskDraft } from "@/types/task";
import { DueDatePicker } from "./due-date-picker";

type BaseProps = {
  onSubmit: (draft: TaskDraft) => void;
  defaultValues?: Partial<TaskDraft>;
};
type AddProps = BaseProps & {
  variant?: "add";
  onCancel?: undefined;
};
type EditProps = BaseProps & {
  variant: "edit";
  onCancel: () => void;
};
type Props = AddProps | EditProps;
const TaskEditor = ({
  onSubmit,
  variant = "add",
  onCancel,
  defaultValues = {},
}: Props) => {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [dueDate, setDueDate] = useState<string | null>(
    defaultValues.dueDate ?? null
  );

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
      dueDate: dueDate,
    };

    onSubmit(draft);

    // clear the form
    form.reset();

    titleRef.current!.focus();
    autoResize(titleRef.current!);
  };
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto"; // Reset height to recalculate
    el.style.height = el.scrollHeight + "px";
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
          defaultValue={defaultValues.title}
          aria-label="Title"
          required
          ref={(ref) => {
            if (ref) {
              autoResize(ref);
            }
            titleRef.current = ref;
          }}
          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
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
          defaultValue={defaultValues.description}
          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
          name="description"
          rows={1}
          aria-label="Description"
          placeholder="Description"
          className="resize-none text-base text-primary outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex justify-between">
        <DueDatePicker value={dueDate} onChange={setDueDate} />
        <div className="flex gap-2">
          {variant === "edit" && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{variant === "add" ? "Add" : "Save"}</Button>
        </div>
      </div>
    </form>
  );
};

export { TaskEditor };
