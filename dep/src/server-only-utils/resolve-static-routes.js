export async function resolveStaticRoutes(routes, StaticRoutesMap) {
  const result = {};

  for (const [routePattern, handler] of Object.entries(routes)) {
    const { Component, prerender, head } = handler;
    if(!Component || prerender === false) continue;
    const staticParamsList = StaticRoutesMap[routePattern];
    if (staticParamsList && /\[.*\]/.test(routePattern)) {
      for (const params of staticParamsList) {
        let resolvedRoute = routePattern;

        // Handle [...param] → can include slashes
        resolvedRoute = resolvedRoute.replace(/\[\.\.\.(\w+)\]/g, (_, key) => {
          return encodeURIComponent(params[key])?.replace(/%2F/g, '/');
        });

        // Handle [param]+ or [param]
        resolvedRoute = resolvedRoute.replace(/\[(\w+)\]\+?/g, (_, key) => {
          return encodeURIComponent(params[key]);
        });

        result[resolvedRoute] = {
          Component : () => Component(params),
          head
        }
      }
    } else {
      result[routePattern] = {
        Component,
        head
      }
    }
  }

  return result;
}


// DEMO

// const StaticRoutesMap = {
//   "/blog/[...slug]": [
//     { slug: "2025/oct/post1" },
//     { slug: "2025/oct/post2" },
//     { slug: "2025/nov/post3" }
//   ],
//   "/user/[id]+": [
//     { id: 1 },
//     { id: 2 },
//     { id: 3 }
//   ],
//   "/product/[category]/[id]": [
//     { category: "books", id: 12 },
//     { category: "tech", id: 5 }
//   ]
// };

// const routes = {
//   "/blog/[...slug]": (params) => `Blog page for ${params.slug}`,
//   "/user/[id]+": (params) => `User ${params.id}`,
//   "/product/[category]/[id]": (params) => `Product ${params.category} #${params.id}`
// };

// resolveStaticRoutes(routes, StaticRoutesMap).then(console.log);
