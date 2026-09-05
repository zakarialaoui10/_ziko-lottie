export function isAsync(fn) {
  return fn && fn.constructor && fn.constructor.name === "AsyncFunction";
}