export const pages = {
  "/src/pages/index.js": () => import("/src/pages/index.js"),
  "/src/pages/me.js": () => import("/src/pages/me.js"),
  "/src/pages/about/index.js": () => import("/src/pages/about/index.js")
}