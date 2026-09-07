import { globImports } from '../server-only-utils/index.js'
import { createFileBasedRouter } from 'ziko/router'

export function createEntryServer(){
    return async function render(_url) {
        const pages = await globImports()
        const app = await createFileBasedRouter({
            pages,
            renderer : async (target, component, props, wrapper) => {
            console.log(component(props))
            },
            target : 'no dom',
            url : _url
        })
        console.log(app)
        const html = `
            <h1> Hello from server </h1>
        `
        return { html }
    }
}