[![ziko-server banner](https://raw.githubusercontent.com/zikojs/.github/main/assets/banners/ziko-server.svg)](https://github.com/zikojs)

# Ziko-server

Server-side rendering for Zikojs with file-based routing and client-side hydration.

# Features 
- ✅ Server Side Rendering 
- ✅ Client Side Hydration with no additional config 
- ✅ File Based Routing 
- ✅ Mdzjs Supports
- ✅ Supports Dynamic Routes
- ✅ Supports both Sync And Async rendering
- ✅ Supports API

<!-- 
compare with type
 -->

# Project Structure
```
App
   ├──public/ 
   ├── src/
      ├── .ziko  #generated
      ├── pages/ # required
            ├── index.js 
      ├── components/
      ├── layouts/
      ├── contents/
      ├── db/
      ├── i18n/
      ├── middlewares.js
   ├── tsconfig.json
   ├── ziko.config.js
   ├── package.json
    
```


# Config 

```js
// server.js
import { createServer } from "ziko-server/server";
createServer()
```

```js
// entry-server.js
import {defineServerEntry} from "ziko-server/entry-server";
export default defineServerEntry({
   pages : import.meta.glob("./pages/**/*{.js,.mdz}")
})
```
```js
// entry-client.js
import {EntryClient} from "ziko-server/entry-client";
EntryClient({
  pages : import.meta.glob("./pages/**/*{.js,.mdz}")
})
```

# ⭐️ Show your support

If you appreciate the project, kindly demonstrate your support by giving it a star!<br>

[![Star](https://img.shields.io/github/stars/zakarialaoui10/ziko-server?style=social)](https://github.com/zakarialaoui10/ziko-server)
<!--## Financial support-->
# License 
This projet is licensed under the terms of MIT License 
<img src="https://img.shields.io/github/license/zakarialaoui10/ziko-server?color=rgb%2820%2C21%2C169%29" width="100" align="right">