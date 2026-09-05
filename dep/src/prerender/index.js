import { 
  globImports,
  renderToString,
  writeToDist,
  ManifestParser,
  resolveStaticRoutes,
 } from "ziko-server/server-only-utils";

import { routesGrouper } from "../utils/routes-matcher.js";

const StaticRoutesMap = {
    "/blog/[...slug]":[
        { slug : 1 },
        { slug : 2 },
        { slug : 3 }
    ],
    "/bb/[lang]/dd/[id]":[
        { lang : "en", id : 1},
        { lang : "en", id : 2},
        { lang : "en", id : 3},
        { lang : "fr", id : 1},
        { lang : "fr", id : 2},
        { lang : "fr", id : 3}
    ]
}



async function prerender({outDir = 'dist'} = "") {
    const PRERENDERED_ROUTES = []
    const pages = await globImports("./src/pages/**/*{.js,.ts,.mdz}") 
    const StaticPages = await resolveStaticRoutes(pages, StaticRoutesMap)

    const grouped = routesGrouper(pages)

    const Manifest = new ManifestParser(`${outDir}/.client/.vite/manifest.json`)
    for(let route in grouped.static){
        const Page = grouped.static[route];
        const {Component, head} = Page
        if(Component){
          const res = await Component();
          const ui = renderToString(res)
          PRERENDERED_ROUTES.push(route)
          writeToDist({route, ui, head, entry_client_path : Manifest.EntryClientFile, outDir})
        }
    }
    for(let route in StaticPages){
        const Page = StaticPages[route];
        const {Component, head} = Page
        if(Component){
          const res = await Component();
          const ui = renderToString(res)
          PRERENDERED_ROUTES.push(route)
        //   console.log({hi :__Ziko__.__HYDRATION__.store, route})
        //   __Ziko__.__HYDRATION__.reset()
          writeToDist({route, ui, head, entry_client_path : Manifest.EntryClientFile, outDir})
        }
        // console.log(PRERENDERED_ROUTES)
    }
}


export { prerender }