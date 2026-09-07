import fg from 'fast-glob'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Server-side replica of Vite's import.meta.glob().
 *
 * @param {string | string[]} pattern - Fast-glob pattern(s)
 * @param {Object} options
 * @param {string} [options.cwd=process.cwd()] - Working directory
 * @param {boolean} [options.eager=false] - Return evaluated exports instead of functions
 * @param {'relative' | 'absolute' | 'fileUrl'} [options.keyType='relative'] - Key formatting style
 * @returns {Promise<Record<string, Function | Promise<any>>>}
 */
export async function globImports(
  pattern = './src/pages/**/*.{js,ts,jsx,tsx}',
  { cwd = process.cwd(), eager = false, keyType = 'relative' } = {}
) {
  const relativePaths = await fg(pattern, { cwd, dot: false })
  /** @type {Record<string, Function | Promise<any>>} */
  const modules = {}

  for (const relativePath of relativePaths) {
    const absolutePath = path.resolve(cwd, relativePath)
    const fileUrl = pathToFileURL(absolutePath).href

    // Determine Key Format
    let key
    if (keyType === 'fileUrl') {
      key = fileUrl
    } else if (keyType === 'absolute') {
      key = absolutePath.split(path.sep).join('/')
    } else {
      // Standard Vite 'relative' behavior
      key = relativePath.split(path.sep).join('/')
      if (!key.startsWith('.') && !key.startsWith('/')) {
        key = `./${key}`
      }
    }

    // Always use full fileUrl for the actual import
    if (eager) {
      modules[key] = await import(/* @vite-ignore */ fileUrl)
    } else {
      modules[key] = () => import(/* @vite-ignore */ fileUrl)
    }
  }

  return modules
}