import {JSDOM} from "jsdom"
const {document} = new JSDOM().window;
globalThis.document = document

const renderDomToString=UIElement=>UIElement.outerHTML;
export {
    renderDomToString
}