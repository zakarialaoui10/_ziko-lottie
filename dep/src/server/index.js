import express from "express";
import { readFile } from "node:fs/promises";
import path, { join } from "node:path";
import { pathToFileURL } from "node:url";
import { dev_server } from "./dev-server.js";
import { API_HANDLER } from "./api-handler.js";
import { 
  importMiddlewares,
  importPrerenderedRoutes,
} from '../server-only-utils/index.js'

import { setup_ziko_folder } from "../setup/setup-ziko-folder.js";
import { SetupMiddleware } from './setup-middleware.js'

export async function createServer({ baseDir = process.cwd(), port = process.env.PORT || 5173 } = {}){
  await setup_ziko_folder(join(baseDir, './.ziko-experimental'))
  const isProduction = process.env.NODE_ENV === "production";
  const base = process.env.BASE || "/";
  const HTML_TEMPLATE = isProduction ? await readFile(join(baseDir, "./dist/.client/.ziko/index.html"), "utf-8") : "";
  const app = express();

  const Middlewares = await importMiddlewares()
  app.use(Middlewares.logger)
  app.use(SetupMiddleware)

  let vite;
  if (!isProduction) vite = await dev_server(app, base)
  else {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(
      base,
      sirv(join(baseDir, "./dist/.client"), { extensions: [] }),
    );
  }

  // Serve HTML
  app.use('/.client', express.static(path.join(process.cwd(), 'dist/.client')))
  // app.use(express.static('public'))
    
  if(isProduction){
      const PRERENDERED_ROUTES = await importPrerenderedRoutes()
      for(let i=0; i<PRERENDERED_ROUTES.length; i++){
        app.get(PRERENDERED_ROUTES[i], (req, res)=>{
          res.sendFile(path.join(process.cwd(), `dist/${PRERENDERED_ROUTES[i]}/index.html`))
        })
      }
  }


  app.get('/--ziko--', (req, res)=>{
    if (isProduction) return res.status(404).end();
    res.json(globalThis.Ziko)
  })

  app.use(async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      let template;
      let render;
      if (!isProduction) {
        template = await readFile(join(baseDir, "./.ziko/index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/.ziko/entry-server.js")).default;
      } 
      else {
        template = HTML_TEMPLATE;
        const ENTRY_SERVER_PATH = pathToFileURL(join(baseDir, "./dist/.server/entry-server.js")).href;
        render = (await import(/* @vite-ignore */ENTRY_SERVER_PATH)).default;
      }
      const rendered = await render(url, req);
      const page = await rendered(url, req);
      if(page.GET) return await API_HANDLER(page.GET, req, res)
      if(page.POST) return await API_HANDLER(page.POST, req, res)
      if(page.PUT) return await API_HANDLER(page.PUT, req, res)
      if(page.DELETE) return await API_HANDLER(page.DELETE, req, res)
      if(page.PATCH) return await API_HANDLER(page.PATCH, req, res)
        
      const html = template
        .replace(
          '<!--app-session-data-->',
          `<script type='application/json' id='ziko-data'>
${JSON.stringify(Ziko, null, 2)}
          </script>
          `
        )
        // .replace(`<!--app-head-->`, page.head ?? "")
        .replace(`<!--app-html-->`, page.ui ?? "")
        
      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } 
    catch (e) {
      vite?.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });

  return app;
}


