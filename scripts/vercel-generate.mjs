import { readFileSync, writeFileSync } from 'fs';

const manifest = JSON.parse(readFileSync('dist/client/.vite/manifest.json', 'utf8'));

const entryKey = Object.keys(manifest).find(
  (k) => manifest[k].isEntry && k.endsWith('.tsx')
);
if (!entryKey) throw new Error('Could not find entry in Vite manifest');

const entry = manifest[entryKey];
const jsFile = `/assets/${entry.file.replace(/^assets\//, '')}`;
const cssFiles = (entry.css ?? []).map((f) => `/assets/${f.replace(/^assets\//, '')}`);

const cssLinks = cssFiles
  .map((href) => `<link rel="stylesheet" href="${href}"/>`)
  .join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>easyDUD - Travel Booking Platform</title>
  <meta name="description" content="easyDUD — smarter, seamless travel booking for buses, flights, hotels, and more."/>
  ${cssLinks}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${jsFile}"></script>
</body>
</html>`;

writeFileSync('dist/client/index.html', html);
console.log(`Generated dist/client/index.html (entry: ${jsFile})`);
