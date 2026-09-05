import {
    normalize_path,
    routesMatcher,
    dynamicRoutesParser,
    isDynamic,
  } from "../utils/index.js";

export function EntryClient({ base = '', pages } = {}) {
  
  if (import.meta.env.DEV) pages = import.meta.glob("/src/pages/**/*{.js,.mdz}");
  pages = import.meta.glob("/src/pages/**/*{.js,.mdz}");
  addEventListener("load", async () => {
    const data = JSON.parse(document.head.querySelector('script#ziko-data')?.textContent ?? "{}")
    globalThis.Ziko = data;
    const root = "./pages/";
    async function hydrate(path) {
      if (path.endsWith("/")) path = path.slice(0, -1);
      const matchEntry = Object.entries(pages).find(([route]) =>
        routesMatcher(normalize_path(route, root), `/${path}`)
      );
      if (!matchEntry) return; 

      const [mask, moduleImport] = matchEntry;

      const module = await moduleImport();
      let UIElement;

      if (isDynamic(mask)) {
        const params = dynamicRoutesParser(mask, `/${path}`);
        UIElement = await module.default(params);
      } else {
        UIElement = await module.default();
      }

      UIElement.unmount();

      const elementsToHydrate = [...document.querySelectorAll('[data-hydration-index]')];
      elementsToHydrate.forEach(el => {
        el.replaceWith(__Ziko__.__HYDRATION__.store.get(+el.dataset.hydrationIndex)().element);
      });
    }

    hydrate(location.pathname.slice(1));
  });
}
