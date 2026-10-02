import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const output = 'dist';
rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, 'Assets/Logo'), { recursive: true });
mkdirSync(join(output, 'Assets/icons'), { recursive: true });
mkdirSync(join(output, 'Assets/PORTFOLIO'), { recursive: true });
for (const file of ['index.html', 'style.css', 'services-catalog.css', 'services-concept.css', 'tramp-case.css', 'app.js', 'kinetic-logo.js', 'favicon.svg', 'robots.txt']) cpSync(file, join(output, file));
for (const folder of ['work', 'services', 'services-concept', 'about', 'contact', 'en', 'zh', 'media', 'fonts']) cpSync(folder, join(output, folder), { recursive: true });
for (const file of ['icon_4.webp', 'tessen_wordmark_accent.webp', 'tessen_wordmark_white.webp', 'fan.svg']) cpSync(join('Assets/Logo', file), join(output, 'Assets/Logo', file));
for (const file of ['website_v3.webp', 'brand_v3.webp', 'media_v3.webp', 'automation_v3.webp', 'idea.webp']) cpSync(join('Assets/icons', file), join(output, 'Assets/icons', file));
for (const file of ['_TEST_Mobile_portfolio_preview@0.5x.webp', 'QRQ_Mobile_portfolio_preview@0.5x.webp', 'PAGER_Mobile_portfolio_preview@0.5x.webp', 'brand_quest_hero_001.webp', 'brand_tessen_001.webp', 'brand_quest_request_001.webp', 'brand_yyo_001.webp', 'brand_kompaniion_001.webp', 'content_tramp_preview.webp', 'content_mitek_preview.webp', 'content_lpaoletti_preview.webp']) cpSync(join('Assets/PORTFOLIO', file), join(output, 'Assets/PORTFOLIO', file));
cpSync('Assets/TRAMP', join(output, 'Assets/TRAMP'), { recursive: true });
cpSync('Assets/MITEK', join(output, 'Assets/MITEK'), { recursive: true });
cpSync('Assets/LPAOLETTI', join(output, 'Assets/LPAOLETTI'), { recursive: true });
if (existsSync('sitemap.xml')) cpSync('sitemap.xml', join(output, 'sitemap.xml'));

mkdirSync(join(output, 'vendor/three'), { recursive: true });
for (const file of ['three.module.min.js', 'three.core.min.js']) cpSync(join('node_modules/three/build', file), join(output, 'vendor/three', file));
cpSync('node_modules/three/examples/jsm/loaders/SVGLoader.js', join(output, 'vendor/three/SVGLoader.js'));
cpSync('node_modules/three/LICENSE', join(output, 'vendor/three/LICENSE'));
