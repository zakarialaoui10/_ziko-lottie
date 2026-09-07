export async function setupEnvironment({ 
  adapterInstance, 
  rootDir, 
  urlBase, 
  clientDistPath,
  isProduction 
}) {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'custom',
      base: urlBase,
    })

    // Vite handles all dev transformation and /@vite/client asset requests
    adapterInstance.use(vite.middlewares)
    return vite
  }

  // PRODUCTION MODE: Serve static client assets from dist/client
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default

  adapterInstance.use(compression())

  // Serve all built assets (JS, CSS, images, favicon) from dist/client
  adapterInstance.usePath(
    urlBase,
    sirv(clientDistPath, {
      dev: false,
      single: false, // Allows static assets to return 404 rather than falling back to HTML
      extensions: []
    })
  )

  return undefined
}