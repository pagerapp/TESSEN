import { readFileSync } from 'node:fs';

export const locales = ['ru', 'en', 'zh'];
export const localizedPath = (locale, path) => locale === 'ru' ? path : `/${locale}${path}`;
const source = readFileSync(new URL('./translations.tsv', import.meta.url), 'utf8');
const dictionary = new Map();
for (const [number, line] of source.split(/\r?\n/).entries()) {
  if (!line || line.startsWith('#')) continue;
  const columns = line.split('\t');
  if (columns.length !== 3 || columns.some(value => !value)) throw new Error(`Invalid translation on line ${number + 1}`);
  const [ru, en, zh] = columns;
  if (dictionary.has(ru)) throw new Error(`Duplicate translation: ${ru}`);
  dictionary.set(ru, { en, zh });
}
const cyrillic = /[А-Яа-яЁё]/;
function translated(value, locale) {
  if (locale === 'ru' || !value.trim()) return value;
  const original = value.trim();
  const result = dictionary.get(original)?.[locale];
  if (!result) {
    if (cyrillic.test(original)) throw new Error(`Missing ${locale} translation: ${original}`);
    return value;
  }
  const start = value.indexOf(original);
  return value.slice(0, start) + result + value.slice(start + original.length);
}
const switchNames = {
  ru: ['Выбор языка', ['Русская версия', 'Английская версия', 'Китайская версия']],
  en: ['Select language', ['Russian version', 'English version', 'Chinese version']],
  zh: ['选择语言', ['俄语版', '英语版', '简体中文版']],
};
function languageSwitch(basePath, locale) {
  const links = locales.map((id, index) => `<a href="${localizedPath(id, basePath)}" lang="${id === 'zh' ? 'zh-CN' : id}" hreflang="${id === 'zh' ? 'zh-CN' : id}" aria-label="${switchNames[locale][1][index]}"${id === locale ? ' aria-current="page"' : ''}>${id === 'zh' ? '中' : id.toUpperCase()}</a>`).join('<span aria-hidden="true">/</span>');
  return `<nav class="language-switch" aria-label="${switchNames[locale][0]}">${links}</nav>`;
}
export function localizeHtml(html, locale, basePath, origin, routes) {
  const pagePath = localizedPath(locale, basePath);
  html = html.replace('lang="ru"', `lang="${locale === 'zh' ? 'zh-CN' : locale}"`);
  html = html.replace('og:locale" content="ru_RU"', `og:locale" content="${{ ru: 'ru_RU', en: 'en_US', zh: 'zh_CN' }[locale]}"`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, json, close) => {
    const data = JSON.parse(json);
    data.description = translated(data.description, locale);
    if (origin) data.url = `${origin}${pagePath}`;
    return open + JSON.stringify(data) + close;
  });
  html = html.replace(/>([^<>]*)</g, (_, value) => `>${translated(value, locale)}<`);
  html = html.replace(/\b(aria-label|alt|title|content)="([^"]*)"/g, (_, attr, value) => `${attr}="${translated(value, locale)}"`);
  const links = new Set(routes);
  html = html.replace(/href="(\/[^"#?]*)([?#][^"]*)?"/g, (whole, href, suffix = '') => links.has(href) ? `href="${localizedPath(locale, href)}${suffix}"` : whole);
  html = html.replace('<span data-language-switch></span>', languageSwitch(basePath, locale));
  if (origin) html = html.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${origin}${pagePath}">`);
  const alternatives = locales.map(id => `<link rel="alternate" hreflang="${id === 'zh' ? 'zh-CN' : id}" href="${origin}${localizedPath(id, basePath)}">`).join('');
  html = html.replace('</head>', `${alternatives}<link rel="alternate" hreflang="x-default" href="${origin}${basePath}"></head>`);
  if (locale !== 'ru' && cyrillic.test(html)) {
    // The embedded logo SVG has no visible Cyrillic after translation, so this catches stale page copy.
    const hits = [...html.matchAll(/.{0,45}[А-Яа-яЁё].{0,70}/g)].slice(0, 5).map(hit => hit[0]);
    throw new Error(`Untranslated ${locale} copy on ${basePath}: ${hits.join(' | ')}`);
  }
  return html;
}
