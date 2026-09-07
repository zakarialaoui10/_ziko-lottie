import { JSDOM } from "jsdom"
const { document } = new JSDOM().window;
globalThis.document = document

export const renderToString = UIElement => UIElement.element?.outerHTML;
