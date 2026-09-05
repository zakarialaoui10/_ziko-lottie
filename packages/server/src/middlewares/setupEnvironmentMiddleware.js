const isProduction = process.env.NODE_ENV === 'production'

export async function setupEnvironmentMiddleware({ adapterInstance, rootDir, urlBase, clientDistPath }) {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({
      root: rootDir,
      server: { middlewareMode: true },
      appType: 'custom',
      base: urlBase,
    })
    adapterInstance.use(vite.middlewares)
    return vite
  }

  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  adapterInstance.use(compression())
  adapterInstance.usePath(urlBase, sirv(clientDistPath, { extensions: [] }))
  return undefined
}