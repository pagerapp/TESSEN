import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const base = existsSync('dist/index.html') ? 'dist' : '.';
const originals = ['index.html', 'work/index.html', 'work/questcenter/index.html', 'work/pager/index.html', 'work/quest-hero/index.html', 'work/tramp/index.html', 'work/mitek/index.html', 'work/lpaoletti/index.html', 'services/index.html', 'services-concept/index.html', 'about/index.html', 'contact/index.html'];
const routes = ['', 'en/', 'zh/'].flatMap(prefix => originals.map(route => prefix + route));
const errors = [];
for (const route of routes) {
  const local = join(base, route);
  if (!existsSync(local)) { errors.push(`Missing page: ${route}`); continue; }
  const html = readFileSync(local, 'utf8');
  if (!html.includes('<h1') || !html.includes('<meta name="description"')) errors.push(`Incomplete metadata or headings: ${route}`);
  const locale = route.startsWith('en/') ? 'en' : route.startsWith('zh/') ? 'zh' : 'ru';
  const expectedLang = locale === 'zh' ? 'zh-CN' : locale;
  if (!html.includes(`<html lang="${expectedLang}"`)) errors.push(`Incorrect document language: ${route}`);
  const baseRoute = route.replace(/^(en|zh)\//, '').replace(/index\.html$/, '');
  const pagePath = baseRoute ? `/${baseRoute}` : '/';
  for (const [language, href] of Object.entries({ ru: pagePath, en: `/en${pagePath}`, zh: `/zh${pagePath}` })) {
    if (!html.includes(`href="${href}" lang="${language === 'zh' ? 'zh-CN' : language}"`)) errors.push(`Missing ${language} language switch in ${route}`);
  }
  if (locale !== 'ru' && /[А-Яа-яЁё]/.test(html)) errors.push(`Untranslated Cyrillic on ${route}`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
    const target = match[1].replace(/^\/+/, '');
    if (!existsSync(join(base, target)) && !existsSync(join(base, target, 'index.html'))) errors.push(`Broken local link in ${route}: ${match[1]}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${routes.length} pages and local links.`);
