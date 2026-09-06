/**
 * Server-side replica of Vite's `import.meta.glob()`.
 *
 * @param pattern - Fast-glob pattern(s).
 * @param options - Configuration options.
 * @param options.cwd - Working directory. Defaults to `process.cwd()`.
 * @param options.eager - Return evaluated exports instead of functions.
 * @param options.keyType - Key formatting style.
 *
 * @returns A promise resolving to a record of module loaders or evaluated
 * module exports.
 */
export function globImports<T = any>(
  pattern?: string | string[],
  options?: GlobImportsOptions
): Promise<GlobImportsResult<T>>;

/**
 * Options for `globImports()`.
 */
export interface GlobImportsOptions {
  /**
   * Working directory used as the base for resolving glob patterns.
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * Whether to eagerly import and evaluate all matched modules.
   *
   * When `false`, each value is a function that lazily imports the module.
   *
   * @default false
   */
  eager?: boolean;

  /**
   * Key formatting style for matched module paths.
   *
   * - `relative` - Relative paths, matching Vite's default behavior.
   * - `absolute` - Absolute filesystem paths.
   * - `fileUrl` - `file://` URLs.
   *
   * @default 'relative'
   */
  keyType?: GlobImportsKeyType;
}

/**
 * Supported key formatting styles for `globImports()`.
 */
export type GlobImportsKeyType =
  | 'relative'
  | 'absolute'
  | 'fileUrl';

/**
 * A lazy module importer returned by `globImports()`
 * when `eager` is `false`.
 */
export type GlobImportLoader<T = any> = () => Promise<T>;

/**
 * Result returned by `globImports()`.
 *
 * When `eager` is `false`, values are lazy module loaders.
 * When `eager` is `true`, values are the evaluated module exports.
 */
export type GlobImportsResult<T = any> = Record<
  string,
  GlobImportLoader<T> | T
>;