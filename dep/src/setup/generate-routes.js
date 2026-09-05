import {writeFileSync} from "fs"
import { join } from "path";

const __pages__ = {
  "/src/pages/index.js": () => import("/src/pages/index.js"),
  "/src/pages/me.js": () => import("/src/pages/me.js"),
  "/src/pages/about/index.js": () => import("/src/pages/about/index.js"),
};

export function generate_routes(){
    const Pages = stringify(__pages__);
    const Output = `export const pages = ${Pages}`
    const path = join(process.cwd(), './.ziko/cache/.generated-routes.js')
    writeFileSync(path, Output)
}

function stringify(obj) {
  const entries = Object.entries(obj).map(
    ([key, val]) => `  "${key}": ${val.toString()}`
  );
  return `{\n${entries.join(",\n")}\n}`;
}
