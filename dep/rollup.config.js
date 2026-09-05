import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
const banner = `
/*
  Project: ziko-server
  Author: Zakaria Elalaoui
  Date : ${new Date()}
  Git-Repo : https://github.com/zakarialaoui10/ziko-server.js
  Released under MIT License
*/
`;
export default [
  {
    input: "src/entry-client.js",
    output: [
      {
        file: "dist/entry-client.js",
        format: "es",
        banner,
      },
    ],
    external: ["ziko"],
    plugins: [resolve(), commonjs()],
  },
  {
    input: "src/entry-server.js",
    output: [
      {
        file: "dist/entry-server.js",
        format: "es",
      },
    ],
  },
  {
    input: "src/server.js",
    output: [
      {
        file: "dist/server.js",
        format: "es",
      },
    ],
  },
];
