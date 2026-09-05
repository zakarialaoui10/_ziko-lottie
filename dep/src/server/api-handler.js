export async function API_HANDLER(fn, req, res) {
  const result = await fn(req, res);

  if (result instanceof Response) {
    const body = await result.text();
    res
      .status(result.status || 200)
      .set(Object.fromEntries(result.headers.entries()))
      .send(body);
    return;
  }
  if (typeof result === "object" && result !== null) {
    res.json(result);
    return;
  }
  if (["string", "number", "boolean"].includes(typeof result)) {
    res.send(String(result));
    return;
  }
  if (result === undefined) return;
  res.status(500).send("Unsupported response type");
}