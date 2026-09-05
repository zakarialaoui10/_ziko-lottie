export function logger(req, res, next) {
  const {url} = req
  // ignore dev & static requests
  if (
    url.startsWith('/@vite') ||
    url.startsWith('/@fs') ||
    url.startsWith('/.well-known') ||
    url.endsWith('.svg') || 
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.ico') 
  ) {
    return next();
  }

  console.log(`Hello from: ${url}`);
  next();
}