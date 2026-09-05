export const dev_server = async (app, base)=>{
    const { createServer } = await import("vite");
    let vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
      base,
    });
    app.use(vite.middlewares);
    return vite
}

// import {join} from 'path'
// export const prod_server = async (app, base, baseDir)=>{
//   const compression = (await import("compression")).default;
//   const sirv = (await import("sirv")).default;
//   app.use(compression());
//   app.use(
//     base,
//     sirv(join(baseDir, "./dist/.client"), { extensions: [] }),
//   );
// }