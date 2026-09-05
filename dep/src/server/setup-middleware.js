// import { join } from 'path';
// import { pathToFileURL } from 'url';
// const ziko_config_path = pathToFileURL(join(process.cwd(), 'ziko.config.js')).href;

export function SetupMiddleware(req, res, next) {
    const protocol = req.protocol || (req.connection.encrypted ? 'https' : 'http');
    const host = req.headers.host;
    const origin = `${protocol}://${host}`
    globalThis.Ziko = {
      engine: 'zikojs',
      isProd : process.env.NODE_ENV === "production",
      url : req.url,
      protocol,
      host,
      origin,
      locals: {},   
    };
    if(globalThis?.__Ziko__) __Ziko__.__HYDRATION__.reset();
  Object.assign(req, {Ziko})
  next();
}