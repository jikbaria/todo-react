import { MessageCircleWarning } from "lucide-react";
import { Button } from "./ui/button";

const AppError = ({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 absolute inset-0">
      <MessageCircleWarning className="size-20" />
      <p className="text-base font-semibold">Something Went Wrong</p>
      <Button onClick={() => resetErrorBoundary()}>Try again</Button>
    </div>
  );
};

export { AppError };
