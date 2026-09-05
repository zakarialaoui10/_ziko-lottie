function routesMatcher(mask, route) {
  const maskSegments = mask.split("/").filter(Boolean);
  const routeSegments = route.split("/").filter(Boolean);

  let i = 0,
    j = 0;

  while (i < maskSegments.length && j < routeSegments.length) {
    const maskSegment = maskSegments[i];
    const routeSegment = routeSegments[j];

    // Catch-all segment `[...param]`
    if (maskSegment.startsWith("[...") && maskSegment.endsWith("]")) {
      const remainingMaskSegments = maskSegments.length - i - 1;

      if (remainingMaskSegments === 0) {
        // Last segment, matches all remaining
        return true;
      }

      // Calculate minimum required route segments for remaining mask
      let requiredSegments = 0;
      for (let k = i + 1; k < maskSegments.length; k++) {
        if (!maskSegments[k].endsWith("]+")) {
          requiredSegments++;
        }
      }

      const remainingRouteSegments = routeSegments.length - j;
      if (remainingRouteSegments < requiredSegments) return false;

      const segmentsToConsume = remainingRouteSegments - requiredSegments;
      if (segmentsToConsume < 1) return false;

      j += segmentsToConsume;
      i++;
      continue;
    }

    // Optional `[param]+`
    if (maskSegment.startsWith("[") && maskSegment.endsWith("]+")) {
      if (routeSegment) j++;
      i++;
      continue;
    }

    // Dynamic `[param]`
    if (maskSegment.startsWith("[") && maskSegment.endsWith("]")) {
      i++;
      j++;
      continue;
    }

    // Must match static segment
    if (maskSegment !== routeSegment) return false;

    i++;
    j++;
  }

  // Handle optional parameters at the end
  while (i < maskSegments.length) {
    const seg = maskSegments[i];
    if (seg.endsWith("]+")) {
      i++;
      continue;
    }
    return false;
  }

  return i === maskSegments.length && j === routeSegments.length;
}

function dynamicRoutesParser(mask, route) {
  const maskSegments = mask.split("/").filter(Boolean);
  const routeSegments = route.split("/").filter(Boolean);
  const params = {};

  let i = 0,
    j = 0;

  while (i < maskSegments.length && j < routeSegments.length) {
    const maskSegment = maskSegments[i];
    const routeSegment = routeSegments[j];

    // Catch-all `[...param]`
    if (maskSegment.startsWith("[...") && maskSegment.endsWith("]")) {
      const paramName = maskSegment.slice(4, -1);

      const remainingMaskSegments = maskSegments.length - i - 1;
      if (remainingMaskSegments === 0) {
        params[paramName] = routeSegments.slice(j).join("/");
        break;
      }

      let requiredSegments = 0;
      for (let k = i + 1; k < maskSegments.length; k++) {
        if (!maskSegments[k].endsWith("]+")) {
          requiredSegments++;
        }
      }

      const remainingRouteSegments = routeSegments.length - j;
      const segmentsToConsume = remainingRouteSegments - requiredSegments;

      if (segmentsToConsume >= 1) {
        params[paramName] = routeSegments
          .slice(j, j + segmentsToConsume)
          .join("/");
        j += segmentsToConsume;
      } else {
        return {};
      }

      i++;
      continue;
    }

    // Optional `[param]+`
    if (maskSegment.startsWith("[") && maskSegment.endsWith("]+")) {
      const paramName = maskSegment.slice(1, -2);
      if (routeSegment) {
        params[paramName] = routeSegment;
        j++;
      }
      i++;
      continue;
    }

    // Dynamic `[param]`
    if (maskSegment.startsWith("[") && maskSegment.endsWith("]")) {
      const paramName = maskSegment.slice(1, -1);
      params[paramName] = routeSegment;
    } else if (maskSegment !== routeSegment) {
      return {};
    }

    i++;
    j++;
  }

  return params;
}

function isDynamic(path) {
  const DynamicPattern = /(:\w+|\[\.\.\.\w+\]|\[\w+\]\+?)/;
  return DynamicPattern.test(path);
}


function routesGrouper(routeMap) {
  const grouped = {
    static: {},
    dynamic: {},
  };

  for (const [path, value] of Object.entries(routeMap)) {
    if (isDynamic(path)) {
      const segments = path.split("/").filter(Boolean);
      const optionalIndex = segments.findIndex(seg => seg.endsWith("]+"));
      const hasInvalidOptional =
        optionalIndex !== -1 && optionalIndex !== segments.length - 1;

      if (hasInvalidOptional) {
        throw new Error(
          `Invalid optional param position in route: "${path}" — optional parameters can only appear at the end.`,
        );
      }

      grouped.dynamic[path] = value;
    } else {
      grouped.static[path] = value;
    }
  }

  return grouped;
}


export { routesMatcher, dynamicRoutesParser, isDynamic, routesGrouper };

// // DEMO
// console.log("=== EXISTING TESTS ===");
// console.log(routesMatcher("/user/[id]+", "/user")); // true
// console.log(routesMatcher("/user/[id]+", "/user/42")); // true
// console.log(routesMatcher("/blog/[...slug]", "/blog/a/b")); // true
// console.log(routesMatcher("/blog/[id]", "/blog")); // false
// console.log(routesMatcher("/product/:id", "/product/99")); // true

// console.log("\n=== PARSER TESTS ===");
// console.log(dynamicRoutesParser("/user/[id]+", "/user"));
// // 👉 {}

// console.log(dynamicRoutesParser("/user/[id]+", "/user/42"));
// // 👉 { id: "42" }

// console.log(dynamicRoutesParser("/blog/[...slug]", "/blog/2025/oct/post"));
// // 👉 { slug: "2025/oct/post" }

// console.log(
//   dynamicRoutesParser("/product/[category]/[id]+", "/product/electronics"),
// );
// // 👉 { category: "electronics" }

// console.log("\n=== FIX TEST ===");
// console.log(dynamicRoutesParser("/[...slug]/[id]", "/sl1/sl2/9"));
// // 👉 { slug: "sl1/sl2", id: "9" }

// console.log(dynamicRoutesParser("/[slug]/[...id]", "/sl1/id1/id2"));
// // 👉 { slug: "sl1", id: "id1/id2" }

// console.log(dynamicRoutesParser("/blog/lang/[lang]/id/[id]", "/blog/lang/en/id/10"));
// // 👉 { lang: "en", id: "10" }


// // Only the last one that can be optional 