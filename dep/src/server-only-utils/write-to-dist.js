import {mkdir, writeFile} from 'fs/promises';
import {join, dirname} from 'path';

export async function writeToDist({route, ui, head, outDir = 'dist', entry_client_path = ''}={}) {
    entry_client_path = `/.client/${entry_client_path}`
    const out = `
<!doctype html>
<html>
<head>
    <script type="module" src="${entry_client_path}"></script>
    <script type='application/json' id='ziko-data'>
${JSON.stringify(globalThis?.Ziko ?? {}, null, 2)}
    </script>
</head>
<body>
${ui}
</body>
</html>
    `
    const filePath = join(outDir, route === '/' ? '' : route, 'index.html');
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, out, 'utf8');
    console.log(`✔️  Saved ${route} → ${filePath}`);
}