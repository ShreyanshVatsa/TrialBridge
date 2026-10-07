import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } },
  test: {
    include: ["tests/unit/**/*.test.ts", "lib/**/*.test.ts", "functions/**/*.test.ts", "scripts/**/*.test.ts"],
    environment: "node",
    reporters: ["dot"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts", "functions/lib/**/*.ts"],
      exclude: ["**/*.test.ts", "lib/**/*.worker.ts", "lib/types/**"],
      reporter: ["text-summary"],
    },
  },
});
