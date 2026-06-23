import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: "src/index.ts",
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "lib",
    platform: "node",
    root: "src",
    copy: ["types"],
  },
  lint: {
    ignorePatterns: ["lib/**", "coverage/**", ".build/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["**/*.spec.ts"],
        rules: {
          "unicorn/no-thenable": "off",
        },
      },
    ],
  },
  test: {
    include: ["src/**/*.spec.ts", "examples/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.spec.ts"],
      reportsDirectory: "coverage",
    },
  },
});
