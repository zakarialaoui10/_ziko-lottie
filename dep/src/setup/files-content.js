const HTMLINDEX = `
<!doctype html>
<html>
<head>
    <title>Ziko - App </title>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="/.ziko/entry-client.js"></script>
    <!--app-head-->
</head>
<body>
    <!--app-html-->
</body>
</html>
`.trim()

const SERVER = `
import { createServer } from "ziko-server/server";
createServer()
`.trim()

const ENTRY_SERVER = `
import {EntryServer} from "ziko-server/entry-server";
export default EntryServer
`.trim()

const ENTRY_CLIENT = `
import {EntryClient} from "ziko-server/entry-client";
EntryClient({
  base : new URL(".", import.meta.url).pathname
})
`.trim()

const PRERENDER_SCRIPT = `
import {prerender} from 'ziko-server'
prerender()
`

const GENERATE_ROUTES_SCRIPT = `
import { generate_routes } from "ziko-server/setup";
generate_routes()
`

export const Files_Content = {
    'index.html': HTMLINDEX,
    'server.js' : SERVER,
    'entry-server.js' : ENTRY_SERVER,
    'entry-client.js' : ENTRY_CLIENT,
    'scripts/prerender.js' : PRERENDER_SCRIPT,
    'scripts/generate-routes.js' : GENERATE_ROUTES_SCRIPT,
    'cache/.keep' : null
}