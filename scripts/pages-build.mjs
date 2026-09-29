import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const source = 'dist';
const output = 'pages-dist';
const base = '/TESSEN';

if (!existsSync(join(source, 'index.html'))) throw new Error('Build dist/ before preparing GitHub Pages');
rmSync(output, { recursive: true, force: true });
cpSync(source, output, { recursive: true });

function filesIn(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const path = join(folder, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function prefix(url) {
  return url.startsWith('/') && !url.startsWith('//') ? `${base}${url}` : url;
}

const pages = filesIn(output).filter(file => file.endsWith('.html'));
for (const file of pages) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/\b(href|src|srcset|poster|action|content)="([^"]*)"/g, (attribute, name, value) => {
    if (name === 'srcset') {
      return `${name}="${value.split(',').map(item => item.replace(/^(\s*)(\/[^\s]+)/, (_, space, url) => `${space}${prefix(url)}`)).join(',')}"`;
    }
    return `${name}="${prefix(value)}"`;
  });
  html = html.replace(/"three":"\/vendor\//g, `"three":"${base}/vendor/`);
  writeFileSync(file, html);
}

for (const [file, original, replacement] of [
  ['style.css', "url('/fonts/", `url('${base}/fonts/`],
  ['kinetic-logo.js', "from '/vendor/", `from '${base}/vendor/`],
  ['kinetic-logo.js', "fetch('/Assets/", `fetch('${base}/Assets/`],
]) {
  const path = join(output, file);
  const content = readFileSync(path, 'utf8');
  if (!content.includes(original)) throw new Error(`Expected reference missing: ${file}: ${original}`);
  writeFileSync(path, content.replaceAll(original, replacement));
}

writeFileSync(join(output, '.nojekyll'), '');

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src|srcset|poster|action)="([^"]*)"/g)) {
    for (const url of match[1].split(',').map(item => item.trim().split(/\s+/)[0])) {
      if (!url.startsWith(base + '/')) continue;
      const target = join(output, url.slice(base.length + 1).split(/[?#]/)[0]);
      if (!existsSync(target) && !existsSync(join(target, 'index.html'))) {
        throw new Error(`Missing Pages target in ${relative(output, file)}: ${url}`);
      }
    }
  }
  if (/(?:href|src|srcset)="\/(?!TESSEN\/|\/)/.test(html)) {
    throw new Error(`Unprefixed path in ${relative(output, file)}`);
  }
}

console.log(`Prepared ${pages.length} pages for https://pagerapp.github.io${base}/`);
