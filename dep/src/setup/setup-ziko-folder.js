import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { Files_Content } from './files-content.js';

export async function setup_ziko_folder(basePath) {
  for (const [file, content] of Object.entries(Files_Content)) {
    const fullPath = join(basePath, file);
    const dir = dirname(fullPath);
    await mkdir(dir, { recursive: true });
    try {
      const existing = await readFile(fullPath, 'utf8');
      if (existing === content) continue;
    } catch {}
    await writeFile(fullPath, content ?? '', 'utf8');
  }
}
