import { cn } from "@/lib/utils";
import { mergeRefs } from "react-merge-refs";

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "auto"; // Reset height to recalculate
  el.style.height = el.scrollHeight + "px";
};
export function TextArea({
  className,
  ref,
  ...props
}: React.ComponentProps<"textarea"> & {
  autoResize?: boolean;
}) {
  return (
    <textarea
      className={cn(
        "resize-none text-base font-semibold text-primary outline-none placeholder:text-muted-foreground",
        className
      )}
      ref={mergeRefs([
        ref,
        (ref) => {
          if (ref && autoResize) {
            // resize on initial render (edit)
            autoResize(ref);
          }
        },
      ])}
      onReset={(e) => {
        if (autoResize) {
          autoResize(e.target as HTMLTextAreaElement);
        }
      }}
      onInput={(e) => {
        if (autoResize) {
          autoResize(e.target as HTMLTextAreaElement);
        }
      }}
      {...props}
    />
  );
}
