import {tags} from "ziko"


async function App(){
    // Ziko.b = 'blog'
    const api = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const res = await api.json()
    return tags.h1(res.title).useClient().onClick(()=>alert(1))

}

export default App
