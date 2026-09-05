import {readFileSync, existsSync} from 'fs';
import {join} from 'path';

export class ManifestParser {
    constructor(relative_path){
        this.#init(relative_path)
    }
    #init(relative_path){
        const file = join(process.cwd(), relative_path);
        if (existsSync(file)) this.manifest = JSON.parse(readFileSync(file, "utf-8"));
        else {
            console.error(`Manifest file not found: ${file}`)
            this.manifest = null
        }
    }
    get EntryClientFile(){
        return this.manifest['.ziko/entry-client.js'].file
    }
}

// const manifest = new ManifestParser('./dist/client/.vite/manifest.json')
// console.log(manifest.files)
