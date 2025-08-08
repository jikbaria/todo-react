import { AppIcon } from "@/assets/icon";
import { LoaderCircle } from "lucide-react";

const AppLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 absolute inset-0">
      <AppIcon className="size-20" />
      <LoaderCircle className="size-8 animate-spin" />
    </div>
  );
};

export { AppLoader };
