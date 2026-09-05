import {tags} from "ziko"


async function App(){
    // console.log(a)
    // console.log({id, lang})
    const api = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const res = await api.json()
    return tags.h1(res.title).onClick(()=>alert(1))

}

export default App
