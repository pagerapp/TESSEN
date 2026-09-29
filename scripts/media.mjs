import { mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const sources = [
  ...Array.from({ length: 6 }, (_, i) => [join('Assets/WEB/Portfolio/QRQ', `QR_00${i + 1}.jpg`), `questcenter-${i + 1}`]),
  ...Array.from({ length: 7 }, (_, i) => [join('Assets/WEB/Portfolio/Pager', `Pager_desktop_00${i + 1}.jpg`), `pager-${i + 1}`]),
  [join('Assets/WEB/Portfolio/Pager', 'Pager_mob_001.jpg'), 'pager-mobile'],
  ...['14.23.08', '14.23.44', '14.25.51', '14.26.06', '14.26.39', '14.27.08', '14.28.27', '14.33.43'].map((time, i) => [join('Assets/QH', `Screenshot 2026-09-17 at ${time}.png`), `quest-hero-${i + 1}`]),
];

mkdirSync('media', { recursive: true });
copyFileSync(join('Assets/Logo/Main veer/NEW V2/V3', 'brand_v3.webp'), join('media', 'hero-brand-v3.webp'));
copyFileSync(join('Assets/Logo/Main veer/NEW V2/V3', 'website_v3.webp'), join('media', 'hero-sites-v3.webp'));
copyFileSync(join('Assets/Logo/Main veer/NEW V2/V3', 'content_003.webp'), join('media', 'hero-content-v3.webp'));
copyFileSync(join('Assets/Logo/Main veer/NEW V2/V3', 'product_v3.webp'), join('media', 'hero-product-v3.webp'));
copyFileSync(join('Assets/Logo/Main veer/NEW V2/V3', 'UX_v3.webp'), join('media', 'hero-interface-v3.webp'));
copyFileSync(join('Assets/Logo/Main veer/NEW V2/V3', 'autimation_v3.webp'), join('media', 'hero-automation-v3.webp'));
for (const [source, name] of [
  ['website_icon.webp', 'websites'],
  ['brand_icon.webp', 'brand'],
  ['content_icon.webp', 'content'],
  ['automation_icon.webp', 'automation'],
]) copyFileSync(join('Assets/icons', source), join('media', `service-${name}-icon.webp`));
for (const [source, name] of sources) {
  for (const width of [800, 1600]) {
    const target = join('media', `${name}-${width}.jpg`);
    if (existsSync(target)) continue;
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '83', '-Z', String(width), source, '--out', target], { stdio: 'ignore' });
  }
}
