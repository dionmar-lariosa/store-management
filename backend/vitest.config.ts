import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,

    // Prevent multiple E2E files from modifying the same database simultaneously.
    maxWorkers: 1,

    // Optional: improve isolation between test files.
    isolate: true
  }
});
