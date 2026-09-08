import { globImports } from '../server-only-utils/index.js'
import { createFileBasedRouter } from 'ziko/router'

export function createEntryServer(){
    return async function render(_url) {
        const pages = await globImports()
        const app = await createFileBasedRouter({
            pages,
            renderer : async (target, component, props, wrapper) => {
            if(component) console.log(component(props))
            },
            target : 'no dom',
            url : _url,
            namedExportHandler : {
                GET: async (exportedFn, context) => {
                    console.log(exportedFn(context.params))
            }
        }
        })
        const {params, namedExports} = app
        const html = `
            <h1> Hello from server </h1>
        `
        return { 
            html,
            params,
            namedExports
        }
    }
}