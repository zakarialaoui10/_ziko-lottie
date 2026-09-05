export const define_derictives=()=>{
    globalThis.use_server_only = Symbol('use-server-only');
    globalThis.use_server_only_end = Symbol('use-server-only-end');
    globalThis.use_client_only = Symbol('use-client-only-end')
}