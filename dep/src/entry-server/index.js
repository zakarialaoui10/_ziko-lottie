import { 
  renderToString,
  globImports,
  readFiles, 
} from "../server-only-utils/index.js";

import { 
  routesMatcher,
  dynamicRoutesParser,
  isDynamic
} from "../utils/routes-matcher.js";

export function EntryServer() {
  return async function render(path, req, res) {
    if(path.endsWith("/")) path = path.slice(0, -1);
    // const all_files = await readFiles()
    const pairs = await globImports("./src/pages/**/*{.js,.mdz}")

    let [mask, module] = Object.entries(pairs).find(([route]) => routesMatcher(route, `/${path}`));
    let UIElement, ui, params;
    if (isDynamic(mask)) params = dynamicRoutesParser(mask, `/${path}`);
    const {Component, GET, POST, DELETE, UPDATE, head, prerender} = await module
    if(Component){
      UIElement = params ? await Component.call(this, params) : await Component();
      ui = renderToString(UIElement);
    }

    return {
      head,
      ui,
      prerender,
      hydration_map : __Ziko__.__HYDRATION__,
      GET,
      POST,
      DELETE,
      UPDATE,
    };
  };
}
