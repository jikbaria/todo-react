import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Suspense, useState } from "react";
import { AppLoader } from "./components/app-loader";
import { TasksPage } from "./pages/tasks";
import { AppError } from "./components/app-error";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <AppError resetErrorBoundary={resetErrorBoundary} />
            )}
          >
            <main className="mx-auto mt-12 max-w-2xl px-5">
              <Suspense fallback={<AppLoader />}>
                <TasksPage />
              </Suspense>
            </main>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
}

export default App;
