import '../src/style.css'
import { setupCounter } from '../src/counter'

setupCounter(document.querySelector('#counter'))

import { createSPAFileBasedRouter } from 'ziko/app/router'


const pages = await import.meta.glob('../*/pages/**/*.js')
console.log(pages)
createSPAFileBasedRouter({
    pages,
    renderer : async (target, component, props, wrapper) => {
      console.log(component)
    },
    target : document.body
})