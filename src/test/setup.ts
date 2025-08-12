import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetDb } from "./mocks/db";
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterEach(() => {
  cleanup();
  localStorage.clear();
  server.resetHandlers();
  resetDb();
});

afterEach(() => {
  server.resetHandlers();
  resetDb();
});
afterAll(() => server.close());
