import { createFileBasedRouter } from 'ziko/router'

export function createEntryClient({ pages }){
    return createFileBasedRouter({
        pages,
        renderer : async (target, component, props, wrapper) => {
        console.log(component({props}))
        },
        target : document.body
    })   
}