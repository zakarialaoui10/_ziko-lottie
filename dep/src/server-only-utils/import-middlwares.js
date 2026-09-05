import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function importMiddlewares({ cwd = process.cwd() } = {}) {
  const possibleFiles = [
    path.join(cwd, 'src', 'middleware.js'),
    path.join(cwd, 'src', 'middleware.ts')
  ];

  for (const file of possibleFiles) {
    if (fs.existsSync(file)) {
      const fileUrl = pathToFileURL(file).href;
      const module = await import(/* @vite-ignore */ fileUrl);

      const middlewares = {};
      for (const [key, value] of Object.entries(module)) {
        if (typeof value === 'function') {
          middlewares[key] = value;
        }
      }

      return middlewares;
    }
  }

  // No middleware file found
  return {};
}
