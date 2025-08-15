import { Button } from "./ui/button";
import type { TaskDraft } from "@/types/task";
import { Controller, useForm } from "react-hook-form";
import { DueDatePicker } from "./due-date-picker";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormMessage } from "./ui/form-message";
import { TextArea } from "./ui/textarea";
import { useEffect } from "react";

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

const FormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, {
      message: "Title must be at least 10 characters.",
    })
    .max(200, {
      message: "Title must not be longer than 200 characters.",
    }),
  description: z.string().max(10000, {
    message: "Description must not be longer than 10000 characters.",
  }),
  dueDate: z.string().nullable(),
});

const TaskEditor = ({
  onSubmit,
  variant = "add",
  onCancel,
  defaultValues = {
    description: "",
    title: "",
    dueDate: null,
  },
}: Props) => {
  const { handleSubmit, reset, control, register, setFocus, formState } =
    useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues,
    });
  const { errors, isSubmitSuccessful } = formState;
  const handleTaskSubmit = (data: z.infer<typeof FormSchema>) => {
    const draft: TaskDraft = {
      title: data.title,
      description: data.description,
      status: "todo",
      dueDate: data.dueDate,
    };
    onSubmit(draft);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      setFocus("title");
      reset();
    }
  }, [isSubmitSuccessful, reset, setFocus]);

  return (
    <form
      onSubmit={handleSubmit(handleTaskSubmit)}
      className="flex w-full flex-col gap-4 rounded-md border border-gray-300 p-3 focus-within:border-gray-400"
    >
      <div className="flex flex-col gap-0.5">
        <TextArea
          {...register("title")}
          name="title"
          rows={1}
          defaultValue={defaultValues.title}
          aria-label="Title"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(handleTaskSubmit)();
            }
          }}
          maxLength={200}
          placeholder="Title"
          className="font-semibold"
        />
        {errors.title?.message && (
          <FormMessage>{errors.title?.message}</FormMessage>
        )}
        <TextArea
          {...register("description")}
          defaultValue={defaultValues.description}
          rows={1}
          aria-label="Description"
          placeholder="Description"
        />
        {errors.description?.message && (
          <FormMessage>{errors.description?.message}</FormMessage>
        )}
      </div>
      <div className="flex justify-between">
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <>
              <DueDatePicker value={field.value} onChange={field.onChange} />
              {errors.dueDate?.message && (
                <FormMessage>{errors.dueDate?.message}</FormMessage>
              )}
            </>
          )}
        />

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
