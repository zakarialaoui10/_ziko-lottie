import {JSDOM} from "jsdom"
const {document} = new JSDOM().window;
globalThis.document = document

const renderToString=UIElement=>UIElement.element?.outerHTML;
export {
    renderToString
}