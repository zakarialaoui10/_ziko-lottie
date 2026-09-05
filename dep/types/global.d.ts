export {};

declare global {
  const Ziko: {
    locals? : {
      auth? : {}
    }
  };
  const use_server_only : unique symbol;
  const use_server_only_end : unique symbol;
}
