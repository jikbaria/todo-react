import { cn } from "@/lib/utils";

export function FormMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-destructive text-sm", className)} {...props} />;
}
