import fg from "fast-glob";
import { readFile } from "fs/promises";
import { resolve, relative } from "path";

export async function readFiles(pattern = './src/**/*.{js,ts}', { cwd = process.cwd() , root = "./pages/"} = {}) {
  const files = await fg(pattern, { cwd });
  const absoluteRoot = resolve(root);
  console.log({files})
  const modules = {};

  const result = new Map()
   for (const file of files) {
    const code = await readFile(file, "utf8");
    if(!code.includes('use client')) continue;
    // Normalize route to something like "src/pages/index.js"
    const route = relative(absoluteRoot, file).replace(/\\/g, "/");
    result.set(route, code);
  }
  console.log(result)
}