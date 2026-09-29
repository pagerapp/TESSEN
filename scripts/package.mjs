import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const output = 'dist';
rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, 'Assets/Logo'), { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'kinetic-logo.js', 'favicon.svg', 'robots.txt']) cpSync(file, join(output, file));
for (const folder of ['work', 'services', 'about', 'contact', 'en', 'zh', 'media', 'fonts']) cpSync(folder, join(output, folder), { recursive: true });
for (const file of ['icon_4.webp', 'tessen_wordmark_accent.webp', 'tessen_wordmark_white.webp', 'fan.svg']) cpSync(join('Assets/Logo', file), join(output, 'Assets/Logo', file));
if (existsSync('sitemap.xml')) cpSync('sitemap.xml', join(output, 'sitemap.xml'));

mkdirSync(join(output, 'vendor/three'), { recursive: true });
for (const file of ['three.module.min.js', 'three.core.min.js']) cpSync(join('node_modules/three/build', file), join(output, 'vendor/three', file));
cpSync('node_modules/three/examples/jsm/loaders/SVGLoader.js', join(output, 'vendor/three/SVGLoader.js'));
cpSync('node_modules/three/LICENSE', join(output, 'vendor/three/LICENSE'));
