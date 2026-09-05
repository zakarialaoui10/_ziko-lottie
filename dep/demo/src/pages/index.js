import { tags } from "ziko/dom"
export const head = {
    title : 'Ziko Server Home Page',
}

export const prerender = false;
const {span} = tags
const App = () =>{
    // Ziko.b = 'Index'
    const ui = tags.p(
        span('Interactive')
            .style({color : "red"})
            .onPtrDown(e=>console.log(e.target))
            .useClient()
            ,
        span('Not Interactive '),
        // span(Ziko.b).useClient(),
        // span(Ziko.isProd ? 'Prod' : 'Dev')
    )
    return ui
}


export default App