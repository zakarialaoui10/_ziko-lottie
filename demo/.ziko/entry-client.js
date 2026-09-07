import '../src/style.css'
import { createEntryClient } from '@zikojs/server/entry-client'

const pages = await import.meta.glob('../*/pages/**/*.js')
console.log(pages)

createEntryClient({
  pages
})