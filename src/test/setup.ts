import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

beforeEach(() => {
  // mock timers
  vi.useFakeTimers({
    shouldAdvanceTime: true,
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});
