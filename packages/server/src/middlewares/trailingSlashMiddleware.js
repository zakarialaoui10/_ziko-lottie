/**
 * Handles trailing slashes based on the specified behavior strategy.
 *
 * @param {'ignore' | 'always' | 'never'} behavior
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {Function} next
 */
export function trailingSlashMiddleware(
  {
    behavior,
    isProduction
  }, req, res, next) {
  // 1. Skip middleware if behavior is 'ignore'
  if (!behavior || behavior === 'ignore') {
    return next()
  }

  const rawUrl = req.originalUrl || req.url
  const [pathname, search] = rawUrl.split('?')
  const queryString = search ? `?${search}` : ''

  // Don't redirect the root path '/' or URLs pointing to static files (e.g. assets)
  const isRoot = pathname === '/'
  const isFile = /\.[a-zA-Z0-9]+$/.test(pathname)

  if (isRoot || isFile) {
    return next()
  }

  const hasTrailingSlash = pathname.endsWith('/')

  // ---------------------------------------------------------------------------
  // Case A: Behavior 'never' -> Require NO trailing slash (e.g. /about)
  // ---------------------------------------------------------------------------
  if (behavior === 'never' && hasTrailingSlash) {
    const targetPath = pathname.replace(/\/+$/, '')
    const targetUrl = targetPath + queryString

    if (!isProduction) {
      const warningHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Trailing Slash Warning</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; background: #1a1a1a; color: #fff; line-height: 1.6; }
              .card { background: #2a2a2a; border-left: 4px solid #f39c12; padding: 1.5rem; border-radius: 6px; max-width: 600px; }
              code { background: #333; padding: 0.2rem 0.4rem; border-radius: 4px; color: #e74c3c; }
              a { color: #3498db; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>[ZikoJS Dev Warning] Trailing Slash Mismatch</h2>
              <p>Requested URL: <code>${rawUrl}</code></p>
              <p>Your trailing slash strategy is configured to <strong>'never'</strong>, but this request includes a trailing slash.</p>
              <p>In production, this request will automatically redirect (301) to: <a href="${targetUrl}"><code>${targetUrl}</code></a></p>
            </div>
          </body>
        </html>
      `
      return res.status(200).set({ 'Content-Type': 'text/html' }).send(warningHtml)
    }

    return res.status(301).set({ Location: targetUrl }).send()
  }

  // ---------------------------------------------------------------------------
  // Case B: Behavior 'always' -> Require trailing slash (e.g. /about/)
  // ---------------------------------------------------------------------------
  if (behavior === 'always' && !hasTrailingSlash) {
    const targetUrl = `${pathname}/${queryString}`

    if (!isProduction) {
      const warningHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Trailing Slash Warning</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; background: #1a1a1a; color: #fff; line-height: 1.6; }
              .card { background: #2a2a2a; border-left: 4px solid #f39c12; padding: 1.5rem; border-radius: 6px; max-width: 600px; }
              code { background: #333; padding: 0.2rem 0.4rem; border-radius: 4px; color: #e74c3c; }
              a { color: #3498db; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>[ZikoJS Dev Warning] Trailing Slash Mismatch</h2>
              <p>Requested URL: <code>${rawUrl}</code></p>
              <p>Your trailing slash strategy is configured to <strong>'always'</strong>, but this request is missing a trailing slash.</p>
              <p>In production, this request will automatically redirect (301) to: <a href="${targetUrl}"><code>${targetUrl}</code></a></p>
            </div>
          </body>
        </html>
      `
      return res.status(200).set({ 'Content-Type': 'text/html' }).send(warningHtml)
    }

    return res.status(301).set({ Location: targetUrl }).send()
  }

  next()
}