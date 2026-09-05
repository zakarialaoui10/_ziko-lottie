import {EntryClient} from "ziko-server/entry-client";
EntryClient({
  base : new URL(".", import.meta.url).pathname
  // pages : import.meta.glob("./pages/**/*{.js,.mdz}")
})