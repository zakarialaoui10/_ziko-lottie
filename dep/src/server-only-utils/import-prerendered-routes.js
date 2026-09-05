import { join } from 'path';
import { pathToFileURL } from 'url';

export async function importPrerenderedRoutes({ cwd = process.cwd(), isProduction } = {}) {
    const file = isProduction 
                    ? join(cwd, 'dist/.server/prerenderd-routes.js') 
                    : join(cwd, '.ziko/cache/.prerenderd-routes.js')
    const FileUrl = pathToFileURL(file).href;
    const module = await import(/* @vite-ignore */ FileUrl);
    return module?.PRERENDERED_ROUTES || []
}
