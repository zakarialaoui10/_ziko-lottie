export function GET({req, res, ...props}){
    return {
        a : 1,
        b : 2
    }
}

// export function GET(req){
//     console.log(req)
//     return new Response(
//         JSON.stringify({
//             name: "Astro",
//             url: "https://astro.build/",
//         }),
//   );
// }