import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import fs from "fs";
import path from "path";

const prod = (process.argv[2] === "production");
const outDir = "todo-timeline";

// Ensure outDir exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy manifest
if (fs.existsSync("manifest.json")) {
  fs.copyFileSync("manifest.json", path.join(outDir, "manifest.json"));
}

const context = await esbuild.context({
  banner: {
    js: "/* eslint-disable */",
  },
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins],
  format: "cjs",
  target: "es2022",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  conditions: ["svelte", "browser"],
  outfile: path.join(outDir, "main.js"),
  plugins: [
    esbuildSvelte({
      compilerOptions: { css: "injected" },
      preprocess: sveltePreprocess(),
    }),
  ],
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
