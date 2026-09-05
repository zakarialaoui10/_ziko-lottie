export function isAPI(fn) {
  return (
    fn 
    && (typeof fn === 'function')
    && ['GET', 'POST', 'DELETE', 'PUT'].includes(fn.name)
  )
}