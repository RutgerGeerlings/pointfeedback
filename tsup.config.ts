import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "next"],
  },
  {
    entry: ["src/api/index.ts"],
    outDir: "dist/api",
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    external: ["react", "react-dom", "next", "@vercel/blob"],
  },
]);
