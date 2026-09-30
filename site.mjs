import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { locales, localizedPath, localizeHtml } from './i18n.mjs';

const assetRevision = path => createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 8);

const email = 'martynov.e1982@gmail.com';
const phone = '+79953003038';
const phoneLabel = '+7 (995) 300-30-38';
const telegram = 'https://t.me/EvgenyM82';
const origin = process.env.SITE_URL?.replace(/\/$/, '') || '';
const routes = ['/', '/work/', '/work/questcenter/', '/work/pager/', '/work/quest-hero/', '/services/', '/about/', '/contact/'];
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>';
const fanArtwork = readFileSync('Assets/Logo/fan.svg', 'utf8');
const inlineFan = (prefix, classes) => fanArtwork
  .replace(/id="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)
  .replace(/aria-labelledby="([^"]+)"/g, (_, id) => `aria-labelledby="${prefix}-${id}"`)
  .replace(/url\(#([^)]*)\)/g, (_, id) => `url(#${prefix}-${id})`)
  .replace('<svg ', `<svg class="${classes}" aria-hidden="true" focusable="false" `);
const headerFan = inlineFan('header', 'brand-icon fan-vector');
const footerFan = inlineFan('footer', 'footer-fan-vector fan-vector');
const standaloneWordmark = '<img class="standalone-wordmark" src="/Assets/Logo/tessen_wordmark_accent.webp" width="1362" height="340" alt="TESSEN" loading="lazy" decoding="async">';

const projects = [
  {
    slug: 'questcenter', index: '01', title: 'QUESTCENTER', category: 'Digital / Brand', tags: 'UX/UI · Платформа бронирования · Айдентика', label: 'Платформа поиска и бронирования квестов', cover: 'questcenter-1',
    description: 'Каталог, карточки квестов и сценарий бронирования в одной цифровой системе.',
    overview: 'QUESTCENTER — платформа, где выбор квеста превращается в понятный маршрут: от первого просмотра каталога до выбора даты и времени.',
    challenge: 'Большой ассортимент, разные сценарии выбора и множество состояний интерфейса требовали ясной структуры. Посетителю нужно быстро понять, какой квест подходит, и без лишних шагов перейти к записи.',
    solution: 'Спроектированы каталог, навигация и фильтрация, подробные страницы квестов, отзывы и сценарий бронирования с календарём и выбором времени. В ходе разработки также исследовались два направления названия и логотипа — QUESTCENTER и QUESTREQUEST.',
    scope: ['UX и структура платформы', 'Дизайн страниц и состояний', 'Каталог и фильтрация', 'Система бронирования', 'Адаптивные интерфейсы', 'Направления айдентики'],
    deliverable: 'Набор связанных экранов и интерфейсных состояний для каталога и бронирования. Проект учитывает контекст реализации на Bitrix24, интеграций и автоматизации.',
    gallery: [
      ['questcenter-2', 'Каталог / акции и тематические подборки'],
      ['questcenter-3', 'Каталог / сценарий выбора'],
      ['questcenter-4', 'Карточка квеста / содержание и действие'],
      ['questcenter-5', 'Бронирование / дата и время'],
      ['questcenter-6', 'Мобильные экраны / ключевые сценарии'],
    ],
  },
  {
    slug: 'pager', index: '02', title: 'PAGER', category: 'Digital / Content', tags: 'Digital product · Сайт · Визуальная система', label: 'Цифровой продукт и система его представления', cover: 'pager-mobile',
    description: 'Многопрофильный продукт и визуальный язык для его цифровой презентации.',
    overview: 'PAGER исследует идею нескольких пространств общения внутри одного аккаунта. Материалы показывают продуктовую логику через сайт, интерфейсные сцены и мобильные композиции.',
    challenge: 'Сложную продуктовую идею важно объяснить без перегрузки. Сайт должен последовательно показать сценарии использования и при этом сохранить характер самого продукта.',
    solution: 'Для презентации выстроены иерархия сообщений, ритм экранов, визуальные сцены и адаптивные композиции. Продуктовые интерфейсы и контент работают как единая система.',
    scope: ['Структура сайта', 'Визуальная система', 'Продуктовые сцены', 'Адаптивный дизайн', 'Контент для презентации'],
    deliverable: 'Система цифровых экранов и мобильных композиций, которая помогает последовательно раскрывать идею продукта.',
    gallery: [
      ['pager-1', 'Первый экран / идея нескольких профилей'],
      ['pager-2', 'Развитие продуктового сценария'],
      ['pager-3', 'Детали цифровой презентации'],
      ['pager-4', 'Продукт и визуальный язык'],
      ['pager-5', 'Модульная система экранов'],
      ['pager-mobile', 'Адаптация для мобильного просмотра'],
    ],
  },
  {
    slug: 'quest-hero', index: '03', title: 'QUEST HERO', category: 'Digital', tags: 'Сайт · Структура · Адаптивный интерфейс', label: 'Сайт для мира приключений', cover: 'quest-hero-1',
    description: 'Цифровая подача квестов, событий и программ в одной системе.',
    overview: 'QUEST HERO — сайт о квестах, мастер-классах и событиях. Материалы показывают несколько направлений и детальные страницы отдельных программ.',
    challenge: 'Разные форматы досуга нужно собрать в понятную навигацию, сохранив атмосферу каждого предложения и удобный путь к деталям.',
    solution: 'В интерфейсе выстроены отдельные уровни для обзора, категорий и подробных программ. Крупные визуалы задают настроение, а структурированные блоки помогают найти нужную информацию.',
    scope: ['Структура разделов', 'Дизайн страниц', 'Подача программ', 'Навигация', 'Адаптивные состояния'],
    deliverable: 'Система страниц для представления квестов и событий с единым визуальным характером.',
    gallery: [
      ['quest-hero-3', 'Программа / первый экран'],
      ['quest-hero-2', 'Детальная страница / визуальная подача'],
      ['quest-hero-4', 'Содержание и детали программы'],
      ['quest-hero-5', 'Информационные блоки'],
      ['quest-hero-6', 'Разделы сайта'],
      ['quest-hero-7', 'Другие страницы проекта'],
    ],
  },
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pic = (name, alt, className = '', eager = false) => `<img class="${className}" src="/media/${name}-1600.jpg" srcset="/media/${name}-800.jpg 800w, /media/${name}-1600.jpg 1600w" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 85vw, 80vw" width="1600" height="${name.startsWith('quest-hero') ? '890' : '1200'}" alt="${esc(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
const link = (href, label, cls = 'text-link') => `<a class="${cls}" href="${href}"><span>${label}</span>${arrow}</a>`;
const mark = '<span class="mark" aria-hidden="true"><img src="/Assets/Logo/fan.svg" width="512" height="512" alt="" loading="lazy" decoding="async"></span>';
const sectionHead = (index, kicker, title) => `<div class="section-head"><div class="section-kicker"><span class="accent">${index}</span><span>${kicker}</span></div><h2>${title}</h2></div>`;
const contactMethod = (label, value, href, attributes = '') => `<a class="contact-method" href="${href}"${attributes}><span class="contact-method-label">${label}</span><span class="contact-method-value">${value}</span><span class="contact-method-arrow" aria-hidden="true">${arrow}</span></a>`;


function header(current) {
  const nav = [
    ['/work/', 'Работы', 'work'], ['/services/', 'Услуги', 'services'], ['/about/', 'О студии', 'about'], ['/contact/', 'Контакты', 'contact'],
  ];
  const navLinks = nav.map(([href, text, id]) => `<a href="${href}" ${current === id ? 'aria-current="page"' : ''}>${text}</a>`).join('');
  return `<a class="skip" href="#main">Перейти к содержанию</a><header class="site-header" id="top"><div class="header-inner"><a class="brand" href="/" aria-label="TESSEN — на главную">${headerFan}<img class="brand-wordmark" src="/Assets/Logo/tessen_wordmark_white.webp" width="1362" height="340" alt=""></a><span class="header-descriptor">BRAND · DIGITAL · CONTENT</span><nav class="desktop-nav" aria-label="Основная навигация">${navLinks}</nav><span data-language-switch></span><a class="header-contact" href="/contact/"><span>Обсудить проект</span>${arrow}</a><button class="menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="Открыть меню"><span></span><span></span></button></div><nav class="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация" hidden>${navLinks}</nav></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-main"><div class="footer-invite"><div class="footer-label">TESSEN / INDEPENDENT STUDIO</div><div class="footer-title">Есть задача?<br><em>Давайте обсудим<span class="punct">.</span></em></div>${link('/contact/', 'Начать разговор', 'footer-cta')}</div><div class="footer-fan" aria-hidden="true">${footerFan}</div></div><div class="footer-contact-panel" aria-label="Контакты TESSEN"><div class="footer-contact-heading micro"><span>НА СВЯЗИ</span><span>ВЫБЕРИТЕ УДОБНЫЙ СПОСОБ</span></div><div class="footer-contact-grid">${contactMethod('ПОЧТА', email, `mailto:${email}`)}${contactMethod('ТЕЛЕФОН', phoneLabel, `tel:${phone}`)}${contactMethod('ТЕЛЕГРАМ', '@EvgenyM82', telegram, ' target="_blank" rel="noopener noreferrer"')}</div></div><div class="footer-bottom"><a href="/" class="footer-wordmark" aria-label="TESSEN — на главную"><img class="footer-icon" src="/Assets/Logo/fan.svg" width="512" height="512" alt="" loading="lazy"><img class="footer-logo" src="/Assets/Logo/tessen_wordmark_white.webp" width="1362" height="340" alt="" loading="lazy"></a><span>Бренды · Сайты · Контент</span><a href="#top">Наверх ↑</a><span>© ${new Date().getFullYear()} TESSEN</span></div></footer>`;
}
function shell({ title, description, current = '', body, path = '/', image = 'questcenter-1', bodyClass = '', preview = false, kinetic = true, stylesheet = '' }) {
  const hasKineticLogo = path !== '/' && !preview && kinetic;
  if (hasKineticLogo && !body.includes('data-kinetic-logo=')) body = body.replace(/<section class="([^"]*)"([^>]*)>/, (_, classes, attributes) => `<section class="${classes} kinetic-intro"${attributes}><div class="kinetic-scene" data-kinetic-logo="${current}" aria-hidden="true"><img class="kinetic-fallback" src="/Assets/Logo/fan.svg" alt="" width="512" height="512"></div>`);
  const kineticScripts = hasKineticLogo ? `<script type="importmap">{"imports":{"three":"/vendor/three/three.module.min.js"}}</script><script type="module" src="/kinetic-logo.js?v=${assetRevision('kinetic-logo.js')}"></script>` : '';
  const fullTitle = title === 'TESSEN' ? 'TESSEN — Бренды, сайты и визуальный контент' : `${title} — TESSEN`;
  const canonical = origin ? `<link rel="canonical" href="${origin}${path}">` : '';
  const ogImage = origin ? `${origin}/media/${image}-1600.jpg` : `/media/${image}-1600.jpg`;
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0a0a0a"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}">${preview ? '<meta name="robots" content="noindex,nofollow">' : ''}${canonical}<meta property="og:type" content="website"><meta property="og:locale" content="ru_RU"><meta property="og:site_name" content="TESSEN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${ogImage}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css">${stylesheet ? `<link rel="stylesheet" href="${stylesheet}?v=${assetRevision(stylesheet.slice(1))}">` : ''}${preview ? '<link rel="stylesheet" href="/services-concept.css">' : ''}<script defer src="/app.js?v=${assetRevision('app.js')}"></script>${kineticScripts}<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'TESSEN', description: 'Независимая студия дизайна, digital и визуального контента', email, telephone: phone, sameAs: [telegram], ...(origin ? { url: origin } : {}) })}</script></head><body${bodyClass ? ` class="${esc(bodyClass)}"` : ''}>${header(current)}<main id="main">${body}</main>${footer()}</body></html>`;
}

function projectTeaser(project, mode = '', headingLevel = 3) {
  const alt = `${project.title}: ${project.label.toLowerCase()}`;
  return `<article class="project-teaser ${mode}" data-category="${project.category.toLowerCase()}"><a class="project-visual" href="/work/${project.slug}/" aria-label="Открыть проект ${project.title}">${pic(project.cover, alt)}<span class="visual-action">Смотреть проект ${arrow}</span></a><div class="project-meta"><span class="project-number">${project.index} / 03</span><div><h${headingLevel}><a href="/work/${project.slug}/">${project.title}</a></h${headingLevel}><p>${project.description}</p></div><span class="project-category">${project.category}</span></div></article>`;
}

function gallerySlide(project) {
  return `<article class="gallery-slide"><a class="gallery-slide-media" href="/work/${project.slug}/" aria-label="Открыть проект ${project.title}">${pic(project.cover, `${project.title}: ${project.label.toLowerCase()}`)}<span class="gallery-open">Смотреть кейс ${arrow}</span></a><div class="gallery-slide-caption"><span class="gallery-slide-index">${project.index} / 03</span><div><h3><a href="/work/${project.slug}/">${project.title}</a></h3><p>${project.description}</p></div><span class="gallery-slide-category">${project.category}</span></div></article>`;
}

const heroWedgeV3 = { wedge: [1316, 2801], imageRadius: 575, sourceTopY: 8 };
const heroMedia = [
  { label: 'Бренд', href: '/services/#brand', src: '/media/hero-brand-v3.webp', ...heroWedgeV3 },
  { label: 'Сайты', href: '/work/quest-hero/', src: '/media/hero-sites-v3.webp', ...heroWedgeV3 },
  { label: 'Контент', href: '/work/pager/', src: '/media/hero-content-v3.webp', ...heroWedgeV3 },
  { label: 'Продукт', href: '/work/pager/', src: '/media/hero-product-v3.webp', ...heroWedgeV3 },
  { label: 'Интерфейсы', href: '/work/questcenter/', src: '/media/hero-interface-v3.webp', ...heroWedgeV3 },
  { label: 'Автоматизация', href: '/services/#automation', src: '/media/hero-automation-v3.webp', ...heroWedgeV3 },
];
const fanPoint = (angle, radius) => {
  const radians = angle * Math.PI / 180;
  return [600 + Math.cos(radians) * radius, 650 + Math.sin(radians) * radius];
};
const fanNumber = value => Number(value.toFixed(1));
const fanArc = (radius, from, to) => Array.from({ length: 33 }, (_, step) => fanPoint(from + (to - from) * step / 32, radius).map(fanNumber).join(',')).join(' ');
const fanLabelStart = -180;
const fanLabelEnd = 0;
const fanSectorGap = 4.25;
const fanPetalWidth = (180 - (heroMedia.length - 1) * fanSectorGap) / heroMedia.length;
const fanSectorAngles = i => {
  const start = fanLabelStart + i * (fanPetalWidth + fanSectorGap);
  return [start, start + fanPetalWidth];
};
const fanGuideAngles = [fanLabelStart, ...Array.from({ length: heroMedia.length - 1 }, (_, i) => fanSectorAngles(i)[1] + fanSectorGap / 2), fanLabelEnd];
const fanLabelRadius = 600;
const fanLabelPath = `M${fanPoint(fanLabelStart, fanLabelRadius).map(fanNumber).join(' ')} A${fanLabelRadius} ${fanLabelRadius} 0 0 1 ${fanPoint(fanLabelEnd, fanLabelRadius).map(fanNumber).join(' ')}`;
const fanImagePath = (start, end) => `M600 650 L${fanPoint(start + .35, 575).map(fanNumber).join(',')} L${fanPoint(end - .35, 575).map(fanNumber).join(',')} Z`;
const fanWedgeImage = (item, start, end) => {
  const [sourceWidth, sourceHeight] = item.wedge;
  const sourceTopY = item.sourceTopY || 0;
  const [leftX, leftY] = fanPoint(start, item.imageRadius || 548);
  const [rightX, rightY] = fanPoint(end, item.imageRadius || 548);
  const topX = (leftX + rightX) / 2;
  const topY = (leftY + rightY) / 2;
  const depth = Math.hypot(600 - topX, 650 - topY);
  const scale = depth / (sourceHeight - sourceTopY);
  const outwardAngle = (start + end) / 2 * Math.PI / 180;
  const acrossAngle = outwardAngle + Math.PI / 2;
  const a = scale * Math.cos(acrossAngle);
  const b = scale * Math.sin(acrossAngle);
  const c = -scale * Math.cos(outwardAngle);
  const d = -scale * Math.sin(outwardAngle);
  const matrix = [
    a,
    b,
    c,
    d,
    topX - a * sourceWidth / 2 - c * sourceTopY,
    topY - b * sourceWidth / 2 - d * sourceTopY,
  ].map(value => Number(value.toFixed(6))).join(' ');
  return `<image href="${item.src}" width="${sourceWidth}" height="${sourceHeight}" preserveAspectRatio="xMidYMid meet" transform="matrix(${matrix})"/>`;
};
const heroMediaFan = `<svg class="hero-media-svg" viewBox="0 0 1200 700" role="group" aria-label="Визуальные направления TESSEN">
  <defs>${heroMedia.map((_, i) => {
    const [start, end] = fanSectorAngles(i);
    return `<clipPath id="hero-petal-${i}"><path d="${fanImagePath(start, end)}"/></clipPath>`;
  }).join('')}<path id="hero-label-arc" d="${fanLabelPath}"/></defs>
  <g class="hero-fan-drafting" aria-hidden="true">
    <line x1="600" y1="0" x2="600" y2="700"/><line x1="0" y1="650" x2="1200" y2="650"/>
    <polyline class="hero-fan-arc" points="${fanArc(625, -180, 0)}"/>
    <polyline class="hero-fan-arc hero-fan-arc-middle" points="${fanArc(590, -180, 0)}"/>
    <polyline class="hero-fan-arc hero-fan-arc-inner" points="${fanArc(220, -180, 0)}"/>
    ${fanGuideAngles.map(angle => {
      const outer = fanPoint(angle, 625);
      const inner = fanPoint(angle, 205);
      return `<line x1="${fanNumber(inner[0])}" y1="${fanNumber(inner[1])}" x2="${fanNumber(outer[0])}" y2="${fanNumber(outer[1])}"/>`;
    }).join('')}
  </g>
  ${heroMedia.map((item, i) => {
    const [start, end] = fanSectorAngles(i);
    const arc = Array.from({ length: 25 }, (_, step) => fanPoint(start + (end - start) * step / 24, 548));
    const points = [[600, 650], ...arc];
    const frameStart = fanPoint(start, 580);
    const frameEnd = fanPoint(end, 580);
    const framePath = `M600 650 L${frameStart.map(fanNumber).join(',')} L${frameEnd.map(fanNumber).join(',')} Z`;
    const imagePath = fanImagePath(start, end);
    const left = Math.min(...points.map(point => point[0]));
    const top = Math.min(...points.map(point => point[1]));
    const width = Math.max(...points.map(point => point[0])) - left;
    const height = Math.max(...points.map(point => point[1])) - top;
    const zoom = item.zoom || 1;
    const imageX = left - width * (zoom - 1) / 2;
    const imageY = top - height * (zoom - 1) * (item.focusY ?? .5);
    const visual = item.wedge
      ? fanWedgeImage(item, start, end)
      : `<image href="${item.src}" x="${fanNumber(imageX)}" y="${fanNumber(imageY)}" width="${fanNumber(width * zoom)}" height="${fanNumber(height * zoom)}" preserveAspectRatio="xMidYMid slice"/>`;
    const midpoint = (start + end) / 2;
    const foldAngle = fanNumber(-90 - midpoint);
    const delay = fanNumber(.16 + i * .11);
    return `<a class="hero-media-petal" data-petal="${i}" href="${item.href}" aria-label="${item.label} — подробнее" style="--fold-angle:${foldAngle}deg;--petal-delay:${delay}s;--life-delay:${3 + i * .32}s;--breathe-angle:${i < 3 ? .28 : -.28}deg"><g class="hero-petal-life"><g class="hero-petal-surface"><path class="hero-petal-matte" d="${framePath}"/><g clip-path="url(#hero-petal-${i})"><path d="${imagePath}" fill="#161318"/><g class="hero-petal-bleed" transform="translate(600 650) scale(1.12) translate(-600 -650)">${visual}</g>${visual}</g><path class="hero-petal-outline" d="${framePath}"/></g></g></a>`;
  }).join('')}
  <g class="hero-fan-hub" role="button" tabindex="0" aria-label="Повторить раскрытие веера"><title>Повторить раскрытие веера</title><circle class="hero-fan-ring" cx="600" cy="650" r="76"/><circle class="hero-fan-ring hero-fan-ring-inner" cx="600" cy="650" r="54"/>
  <path class="hero-fan-core" d="M597 632 Q600 629 603 632 L618 647 Q621 650 618 653 L603 668 Q600 671 597 668 L582 653 Q579 650 582 647Z"/></g>
  ${heroMedia.map((item, i) => {
    const [start, end] = fanSectorAngles(i);
    const midpoint = (start + end) / 2;
    const offset = fanNumber((midpoint - fanLabelStart) / (fanLabelEnd - fanLabelStart) * 100);
    return `<text class="hero-media-label" data-petal="${i}" aria-hidden="true" style="--label-delay:${1.3 + i * .11}s"><textPath href="#hero-label-arc" startOffset="${offset}%"><tspan class="hero-media-number">0${i + 1}</tspan><tspan class="hero-media-divider"> / </tspan>${item.label.toUpperCase()}</textPath></text>`;
  }).join('')}
</svg>`;

const home = shell({ title: 'TESSEN', path: '/', description: 'TESSEN — независимая студия. Проектируем бренды, сайты и визуальный контент: от структуры до работающего результата.', body: `
<section class="hero dark-section">
  <div class="hero-atmosphere" aria-hidden="true"><span class="hero-glow hero-glow-one"></span><span class="hero-glow hero-glow-two"></span><span class="hero-glow hero-glow-three"></span></div>
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="hero-type-field" aria-hidden="true"><div class="hero-type-track"><span>ИДЕЯ · ФОРМА · РЕЗУЛЬТАТ ·</span><span>ИДЕЯ · ФОРМА · РЕЗУЛЬТАТ ·</span></div></div>
  <div class="hero-top micro"><span>СИСТЕМНЫЙ ДИЗАЙН ДЛЯ БИЗНЕСА</span><span>МОСКВА / УДАЛЁННО</span></div>
  <div class="hero-stage">
    <div class="hero-content"><h1 aria-label="Бренд. Сайт. Контент."><span class="hero-title-line"><span>БРЕНД</span><span class="hero-title-mark" aria-hidden="true"></span></span><span class="hero-title-line"><span>САЙТ</span><span class="hero-title-mark" aria-hidden="true"></span></span><span class="hero-title-line"><span>КОНТЕНТ</span><span class="hero-title-mark" aria-hidden="true"></span></span></h1><div class="hero-bottom"><p>Проектируем айдентику, сайты и визуальный контент как одну систему — от задачи до запуска.</p><div class="hero-actions"><a class="hero-primary" href="#selected"><span>Смотреть проекты</span>${arrow}</a><a class="hero-secondary" href="/contact/">Обсудить задачу</a></div></div></div>
    <div class="hero-media-fan">${heroMediaFan}</div>
  </div>
  <div class="hero-footer micro"><span>ЗАДАЧА / СИСТЕМА / РЕЗУЛЬТАТ</span><span>ЛИСТАЙТЕ ВНИЗ ↓</span></div>
</section>
<section class="selected light-section section-pad" id="selected"><div class="container">${sectionHead('01', 'SELECTED WORK', 'Избранные<br>проекты.')}<div class="gallery-toolbar"><span class="micro">ТРИ ПРОЕКТА / ТРИ РАЗНЫЕ ЗАДАЧИ</span><div class="gallery-nav"><span class="gallery-count" aria-live="polite"><strong data-gallery-current>01</strong> / 03</span><button class="gallery-arrow gallery-arrow-prev" type="button" aria-label="Предыдущий проект" aria-controls="selected-gallery" disabled>${arrow}</button><button class="gallery-arrow gallery-arrow-next" type="button" aria-label="Следующий проект" aria-controls="selected-gallery">${arrow}</button></div></div><div class="gallery-track" id="selected-gallery" role="region" aria-label="Галерея избранных проектов" tabindex="0">${projects.map(gallerySlide).join('')}</div><div class="gallery-progress" aria-hidden="true"><span></span></div><div class="gallery-bottom"><span class="micro">ЛИСТАЙТЕ ГАЛЕРЕЮ →</span>${link('/work/', 'Все проекты')}</div></div></section>
<section class="capabilities dark-section section-pad"><div class="container">${sectionHead('02', 'WHAT WE DO', 'Три направления.<br>Одна логика работы.')}<div class="capability-list"><div class="capability"><span class="micro accent">01 / BRAND</span><h3>Бренд</h3><p>Логотипы, айдентика и визуальные системы, которые держат характер на каждом носителе.</p><span class="capability-tags">ИДЕНТИКА / АРТ-ДИРЕКШН / ЗАПУСК</span></div><div class="capability"><span class="micro accent">02 / DIGITAL</span><h3>Диджитал</h3><p>Сайты и интерфейсы с ясной структурой, продуманными сценариями и точной визуальной подачей.</p><span class="capability-tags">САЙТЫ / UX/UI / ПРОДУКТЫ</span></div><div class="capability"><span class="micro accent">03 / CONTENT</span><h3>Контент</h3><p>Визуальные материалы для продуктов, кампаний и цифровых площадок — как часть общей системы.</p><span class="capability-tags">КАМПАНИИ / ИЗОБРАЖЕНИЯ / ПРОДАКШН</span></div></div><div class="section-outro">${link('/services/', 'Подробнее об услугах')}</div></div></section>
<section class="manifesto light-section section-pad"><div class="container manifesto-grid"><div class="micro">03 / ПОДХОД<br>${mark}</div><div><p class="manifesto-lead">Не останавливаемся на красивом макете.</p><p>Соединяем задачу, структуру и визуальный язык. Проектируем то, что можно использовать, развивать и запускать.</p>${link('/about/', 'О студии')}</div></div></section>
<section class="process dark-section section-pad"><div class="container">${sectionHead('04', 'PROCESS', 'От первого разговора<br>до запуска.')}<div class="process-list">${[['01','Задача','Разбираемся в контексте, аудитории и ограничениях.'],['02','Структура','Собираем логику и путь пользователя.'],['03','Концепция','Находим визуальное направление и систему.'],['04','Реализация','Доводим экраны, материалы и детали.'],['05','Запуск','Готовим результат к работе в реальной среде.']].map(row=>`<div class="process-row"><span>${row[0]}</span><h3>${row[1]}</h3><p>${row[2]}</p></div>`).join('')}</div></div></section>` });

const work = shell({ title: 'Работы', current: 'work', path: '/work/', description: 'Избранные проекты TESSEN: цифровые продукты, сайты, брендинг и визуальный контент.', body: `<section class="page-intro dark-section"><div class="container"><div class="page-eyebrow micro"><span class="accent">INDEX / 001</span><span>АРХИВ ПРОЕКТОВ</span></div><h1>РАБОТЫ<span class="punct">.</span></h1><div class="intro-bottom"><p>Разные задачи. Один принцип: сначала понять, что должно работать — затем найти точную форму.</p><span class="micro">03 ПРОЕКТА / 2026</span></div></div></section><section class="work-archive light-section section-pad"><div class="container"><div class="filter-bar" role="group" aria-label="Фильтр проектов"><button type="button" class="is-active" data-filter="all" aria-pressed="true">Все <sup>03</sup></button><button type="button" data-filter="digital" aria-pressed="false">Digital <sup>03</sup></button><button type="button" data-filter="brand" aria-pressed="false">Brand <sup>01</sup></button><button type="button" data-filter="content" aria-pressed="false">Content <sup>01</sup></button></div><div class="archive-list">${projects.map((p, i)=>projectTeaser(p, i === 0 ? 'teaser-featured' : i === 1 ? 'teaser-offset' : 'teaser-wide', 2)).join('')}</div></div></section>` });

function casePage(project, next) {
  const lead = project.slug === 'questcenter' ? 'Проектирование сложной платформы — от выбора квеста до подтверждения времени.' : project.description;
  return shell({ title: project.title, path: `/work/${project.slug}/`, current: 'work', description: `${project.title}: ${project.label}. Кейс TESSEN — ${project.tags}.`, image: project.cover, body: `<article class="case-page"><section class="case-intro dark-section"><div class="container"><div class="case-breadcrumb micro"><a href="/work/">РАБОТЫ</a><span>/</span><span>${project.index} / 03</span><span>${project.category.toUpperCase()}</span></div><h1>${project.title}<span class="punct">.</span></h1><div class="case-summary"><p>${lead}</p><span>${project.tags}</span></div></div></section><div class="case-cover dark-section">${pic(project.cover, `${project.title} — ${project.label}`, '', true)}</div><section class="case-overview light-section section-pad"><div class="container case-overview-grid"><div class="micro"><span class="accent">01 / ОБЗОР</span><br>${project.title}</div><div><h2>${project.overview}</h2><div class="case-columns"><div><h3>Задача</h3><p>${project.challenge}</p></div><div><h3>Решение</h3><p>${project.solution}</p></div></div></div></div></section><section class="case-scope dark-section section-pad"><div class="container"><div class="micro accent">02 / ОБЪЁМ РАБОТ</div><div class="scope-grid">${project.scope.map((item, i)=>`<div><span class="micro">${String(i+1).padStart(2,'0')}</span><span>${item}</span></div>`).join('')}</div></div></section><section class="case-gallery light-section section-pad"><div class="container">${sectionHead('03', 'SELECTED FRAMES', 'Система в деталях.')}<div class="gallery-grid">${project.gallery.map(([name, caption], i)=>`<figure class="gallery-item ${i % 3 === 0 ? 'gallery-wide' : ''}">${pic(name, `${project.title}: ${caption}`)}<figcaption><span>${String(i+1).padStart(2,'0')} / ${String(project.gallery.length).padStart(2,'0')}</span><span>${caption}</span></figcaption></figure>`).join('')}</div></div></section><section class="case-outcome dark-section section-pad"><div class="container case-outcome-grid"><div class="micro accent">04 / РЕЗУЛЬТАТ</div><p>${project.deliverable}</p></div></section><a class="next-project" href="/work/${next.slug}/"><div class="container"><span class="micro">СЛЕДУЮЩИЙ ПРОЕКТ / ${next.index}</span><span>${next.title}${arrow}</span></div></a></article>` });
}

const webFormats = [
  { number: '01', title: 'Лендинг', price: '19 900 ₽', audience: 'Когда тексты и материалы уже готовы.', scope: '1 страница · до 6 смысловых блоков', materials: 'Тексты и материалы клиента', revisions: '1 раунд корректировок', included: ['Структура и одна визуальная концепция', 'Дизайн, адаптив и форма заявки', 'Базовая техническая настройка и публикация', '1 раунд корректировок'], note: 'Тексты и исходные материалы предоставляет клиент.' },
  { number: '02', title: 'Лендинг под ключ', price: '34 900 ₽', audience: 'Когда нужна готовая страница без подготовки контента.', scope: '1 страница · до 6–7 смысловых блоков', materials: 'Тексты и визуалы готовим мы', revisions: '2 раунда корректировок', included: ['Структура и тексты с нуля', 'Необходимый для страницы визуальный контент и индивидуальный дизайн', 'Адаптив, форма, базовая аналитика и техническая настройка', 'Публикация и 2 раунда корректировок'], note: 'Клиент предоставляет информацию о бизнесе — остальное собираем сами.' },
  { number: '03', title: 'Сайт для бизнеса', price: 'от 39 900 ₽', audience: 'Когда бизнесу нужно несколько связанных страниц.', scope: 'До 3 уникальных страниц в согласованном объёме', materials: 'Тексты и основные материалы клиента', revisions: 'До 2 раундов корректировок', included: ['Структура и одна визуальная концепция', 'Дизайн для desktop, tablet и mobile', 'Формы, базовая аналитика и SEO-настройка', 'Сборка, публикация и до 2 раундов корректировок'], note: 'Тексты и основные материалы предоставляет клиент. Производство контента можно добавить отдельно.' },
];
const webProjects = [
    { title: 'Редизайн сайта', price: 'от 29 900 ₽', description: 'Новый визуальный уровень при сохранении большей части структуры и контента.' },
    { title: 'Продуктовый / специальный сайт', price: 'от 99 900 ₽', description: 'Сложная структура, индивидуальные интерфейсы, анимация и нестандартные сценарии.', featured: true },
    { title: 'Интернет-магазин', price: 'от 129 900 ₽', description: 'Каталог, карточки товаров, корзина, заказ и необходимые интеграции.', featured: true },
];
const serviceGroups = [
  { id: 'brand', number: '02', name: 'BRAND', title: 'Бренд', description: 'Знак и визуальный язык, которые держат характер на каждом носителе.', offers: [
    { title: 'Логотип', price: 'от 24 900 ₽', description: 'Концепция знака или wordmark, базовые версии и подготовка файлов.' },
    { title: 'Айдентика / Mini Identity', price: 'от 39 900 ₽', description: 'Логотип, цвет, типографика, визуальный язык и базовые носители.', featured: true },
  ] },
  { id: 'content', number: '03', name: 'CONTENT', title: 'Контент', description: 'Тексты и изображения, которые продолжают визуальную систему бренда.', offers: [
    { title: 'Визуалы для бизнеса', price: '9 900 ₽', description: '5 самостоятельных коммерческих изображений в одной визуальной концепции.', featured: true },
    { title: 'Тексты для лендинга', price: 'от 9 900 ₽', description: 'Оффер, заголовки, основные смысловые блоки и призывы к действию.' },
    { title: 'Тексты для сайта', price: 'от 19 900 ₽', description: 'До 3 основных страниц.' },
    { title: 'Расширенное визуальное производство', price: 'по оценке', description: 'Сложные сцены, серии изображений и рекламные кампании.' },
  ] },
  { id: 'automation', number: '04', name: 'AUTOMATION', title: 'Автоматизация', description: 'Соединяем формы, CRM, уведомления и передачу данных в работающий процесс.', offers: [
    { title: 'Интеграции и автоматизация', price: 'от 29 900 ₽', description: 'Формы, CRM, уведомления и рабочие сценарии. Нестандартные API оцениваем отдельно.', featured: true },
  ] },
];
const extras = [
  ['Дополнительная уникальная страница', '9 900 ₽'],
  ['Страница по существующему шаблону сайта', '4 900 ₽'],
  ['Дополнительная дизайн-концепция', '9 900 ₽'],
  ['Дополнительный язык', '+25%'],
  ['Срочная реализация', '+30%'],
  ['Сопровождение после запуска', 'от 7 900 ₽ / мес.'],
  ['Сложные формы / калькуляторы', 'по оценке'],
  ['CRM / API / нестандартные интеграции', 'по оценке'],
  ['WordPress / 1С-Битрикс / custom-разработка', 'по оценке'],
  ['Лицензии, хостинг, платные сервисы', 'оплачиваются отдельно'],
];
const svcRoutes = [
  ['websites', '01', 'Сайты', 'Лендинг, бизнес-сайт или магазин под вашу задачу', 'Лендинг · сайт · магазин', '19 900 ₽', 'website_v3.webp'],
  ['brand', '02', 'Бренд', 'Логотип и визуальный язык для бизнеса', 'Логотип · айдентика', 'от 24 900 ₽', 'brand_v3.webp'],
  ['content', '03', 'Контент', 'Тексты и изображения для сайта и продвижения', 'Тексты · визуалы', '9 900 ₽', 'media_v3.webp'],
  ['automation', '04', 'Автоматизация', 'Формы, CRM и уведомления без ручной рутины', 'Формы · CRM · сценарии', 'от 29 900 ₽', 'automation_v3.webp'],
];
const svcRoute = ([id, number, title, description, shortDescription, price, icon], index) => `<a class="svc-route" href="#${id}" data-service-index="${index}"><span class="svc-route-id micro">${number} / 04</span><img class="svc-route-icon" src="/Assets/icons/${icon}" alt="" width="256" height="256" loading="eager" decoding="async" aria-hidden="true"><span class="svc-route-bottom"><strong>${title}</strong><small class="svc-route-detail">${description}</small><small class="svc-route-short">${shortDescription}</small><span class="svc-route-price">${price}<span aria-hidden="true"> ↗</span></span></span></a>`;
const svcWebOffer = ({ number, title, price, audience, scope, materials, revisions, included, note }) => `<article class="svc-web-offer" id="web-format-${number}"><div class="svc-offer-num micro">${number} / 03</div><div class="svc-web-main"><h3>${title}</h3><p>${audience}</p></div><strong class="svc-price">${price}</strong><dl class="svc-web-facts"><div><dt>Объём</dt><dd>${scope}</dd></div><div><dt>Материалы</dt><dd>${materials}</dd></div></dl><details class="svc-web-details"><summary>Полный состав и условия <span aria-hidden="true">+</span></summary><div class="svc-detail-content"><div><span class="micro">Правки</span><p>${revisions}</p></div><ul>${included.map(item => `<li>${item}</li>`).join('')}</ul><p class="svc-detail-note">${note}</p>${link('/contact/', 'Обсудить формат', 'svc-detail-link')}</div></details></article>`;
const svcOffer = ({ title, price, description }, index, total) => `<article class="svc-offer"><span class="micro svc-offer-num">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span><div class="svc-offer-copy"><h3>${title}</h3><p>${description}</p></div><strong class="svc-price">${price}</strong>${link('/contact/', 'Обсудить', 'svc-offer-action')}</article>`;
const svcBrandOffers = [...serviceGroups[0].offers, { title: 'Бренд + сайт', price: 'от 79 900 ₽', description: 'Базовая айдентика и сайт как одна визуальная система. Состав страниц и материалов определяем перед стартом.' }];
const svcCategory = ({ id, number, name, title, description, offers }) => `<section class="svc-category" id="${id}" aria-labelledby="svc-${id}-title"><div class="container svc-category-grid"><div class="svc-category-intro"><span class="micro accent">${number} / ${name}</span><h2 id="svc-${id}-title">${title}<span class="punct">.</span></h2><p>${description}</p></div><div class="svc-offer-list">${(id === 'brand' ? svcBrandOffers : offers).map((offer, index, all) => svcOffer(offer, index, all.length)).join('')}</div></div></section>`;
const serviceBlueprint = `<div class="svc-blueprint" aria-hidden="true">
<svg class="svc-blueprint-wide" viewBox="0 0 1440 2200" preserveAspectRatio="xMidYMid slice" focusable="false">
  <g class="svc-blueprint-fine"><path d="M72 0v2200M720 0v2200M1368 0v2200M0 360h1440M0 1110h1440M0 1810h1440" stroke-dasharray="3 12"/><path d="M0 95h450M990 95h450M0 760h260M1170 760h270M0 1510h390M1090 1510h350"/></g>
  <g class="svc-blueprint-line"><circle cx="1040" cy="410" r="500"/><circle cx="1040" cy="410" r="375"/><circle cx="1040" cy="410" r="245"/><path d="M1040 0v1000M530 410h910M650 20l780 780M1430 20L650 800"/><circle cx="1040" cy="410" r="96"/><ellipse cx="1040" cy="410" rx="35" ry="96"/><ellipse cx="1040" cy="410" rx="96" ry="35"/></g>
  <g class="svc-blueprint-line"><path d="M-70 1210 480 880 1030 1210 480 1540Z M110 1210 480 990 850 1210 480 1430Z M480 880v660M-70 1210l550 330 550-330M-70 1210l550-330 550 330"/><path d="M205 1045v330M755 1045v330M480 990v440" stroke-dasharray="5 11"/></g>
  <g class="svc-blueprint-line"><circle cx="1050" cy="1910" r="390"/><circle cx="1050" cy="1910" r="250"/><circle cx="1050" cy="1910" r="106"/><path d="M1050 1510v690M660 1910h780M775 1635l550 550M1325 1635l-550 550"/></g>
  <g class="svc-blueprint-accent"><circle cx="1040" cy="410" r="5"/><circle cx="480" cy="880" r="4"/><circle cx="1030" cy="1210" r="4"/><circle cx="1050" cy="1910" r="5"/><rect x="286" y="111" width="8" height="8"/><rect x="1301" y="934" width="8" height="8"/><rect x="242" y="1825" width="8" height="8"/></g>
</svg>
<svg class="svc-blueprint-mobile" viewBox="0 0 390 2200" preserveAspectRatio="xMidYMid slice" focusable="false">
  <g class="svc-blueprint-fine"><path d="M195 0v2200M15 0v2200M375 0v2200M0 370h390M0 1050h390M0 1770h390" stroke-dasharray="3 11"/><path d="M0 125h145M245 125h145M0 760h85M305 760h85M0 1460h95M295 1460h95"/></g>
  <g class="svc-blueprint-line"><circle cx="195" cy="365" r="285"/><circle cx="195" cy="365" r="205"/><circle cx="195" cy="365" r="128"/><path d="M195 0v740M-95 365h580M-20 150l430 430M410 150-20 580"/><circle cx="195" cy="365" r="90"/><ellipse cx="195" cy="365" rx="32" ry="90"/><ellipse cx="195" cy="365" rx="90" ry="29"/></g>
  <g class="svc-blueprint-line"><path d="M-170 1220 195 1000 560 1220 195 1440Z M-55 1220 195 1070 445 1220 195 1370Z M195 1000v440M-170 1220l365 220 365-220"/><path d="M-55 1220v210M445 1220v210M195 1070v300" stroke-dasharray="5 11"/></g>
  <g class="svc-blueprint-line"><circle cx="195" cy="1900" r="245"/><circle cx="195" cy="1900" r="155"/><circle cx="195" cy="1900" r="68"/><path d="M195 1650v550M-60 1900h510M25 1730l340 340M365 1730 25 2070"/></g>
  <g class="svc-blueprint-accent"><circle cx="195" cy="365" r="4"/><circle cx="195" cy="1000" r="4"/><circle cx="195" cy="1900" r="4"/><rect x="73" y="82" width="7" height="7"/><rect x="310" y="830" width="7" height="7"/><rect x="49" y="1590" width="7" height="7"/></g>
</svg></div>`;
const services = shell({ title: 'Услуги', current: 'services', path: '/services/', bodyClass: 'services-rework', stylesheet: '/services-catalog.css', description: 'Стоимость услуг TESSEN: лендинги, сайты, брендинг, визуальный контент и автоматизация. Форматы работы и состав проектов.', body: `<section class="svc-hero dark-section"><div class="svc-hero-logo kinetic-scene" data-kinetic-logo="services" aria-hidden="true"><img class="kinetic-fallback" src="/Assets/Logo/fan.svg" alt="" width="512" height="512"></div><div class="container svc-hero-content"><div class="svc-hero-main"><div class="svc-hero-copy"><div class="svc-hero-top micro"><span>Услуги и цены</span></div><img class="svc-hero-idea" src="/Assets/icons/idea.webp" alt="" width="256" height="256" loading="eager" decoding="async" aria-hidden="true"><div class="svc-hero-copy-bottom"><h1>С чего начнем?</h1><p>Сайт, бренд, контент и автоматизация — с ясным результатом, составом и стоимостью.</p></div></div><nav class="svc-routes" aria-label="Выбрать направление">${svcRoutes.map(svcRoute).join('')}</nav></div></div></section>
<section class="svc-web-section light-section" id="websites" aria-labelledby="svc-web-title">${serviceBlueprint}<div class="container"><div class="svc-section-heading"><span class="micro accent">01 / DIGITAL</span><div><h2 id="svc-web-title">Выберите формат сайта<span class="punct">.</span></h2><p>Сравните объём, материалы и цену. Полный состав раскрывается в каждой карточке.</p></div></div><div class="svc-web-swipe micro" aria-hidden="true">ЛИСТАЙТЕ КАРТОЧКИ →</div><div class="svc-web-list">${webFormats.map(svcWebOffer).join('')}</div><div class="svc-secondary"><div class="svc-secondary-intro"><span class="micro accent">DIGITAL / 04—06</span><h3>Сложные цифровые задачи</h3><p>Когда нужен редизайн, магазин или особый цифровой сценарий.</p></div><div class="svc-web-swipe micro" aria-hidden="true">ЛИСТАЙТЕ КАРТОЧКИ →</div><div class="svc-offer-list">${webProjects.map((offer, index) => svcOffer(offer, index, webProjects.length)).join('')}</div></div><p class="svc-price-note">Цены в рублях. Для услуг с пометкой «от» итоговую стоимость определяем после обсуждения объёма работ.</p><a class="svc-case" href="/work/questcenter/"><span class="svc-case-media"><img src="/media/questcenter-1-1600.jpg" width="1600" height="1000" alt="QUESTCENTER — платформа поиска и бронирования квестов" loading="lazy" decoding="async"></span><span class="svc-case-copy"><span class="micro accent">ПРОЕКТ / DIGITAL</span><strong>QUESTCENTER</strong><span>Проектирование сложной платформы — от выбора квеста до подтверждения времени.</span><em>Смотреть кейс</em></span></a></div></section>
<div class="svc-catalog light-section" aria-label="Бренд, контент и автоматизация">${serviceGroups.map(svcCategory).join('')}</div>
<section class="svc-extras light-section" aria-labelledby="svc-extras-title"><div class="container svc-extras-grid"><div><span class="micro accent">05 / ДОПОЛНИТЕЛЬНО</span><h2 id="svc-extras-title">Дополнительные работы<span class="punct">.</span></h2><p>Расширяем объём проекта по мере задачи.</p></div><details class="extras-disclosure"><summary><span>Смотреть дополнения</span><span class="micro">10 ПОЗИЦИЙ</span></summary><div class="extras-list">${extras.map(([name, price]) => `<div class="extras-row"><span>${name}</span><strong>${price}</strong></div>`).join('')}</div><p>Объём перевода, сроки срочной реализации и состав сложных интеграций согласовываем до начала работ.</p></details></div></section>
<section class="scope-note dark-section section-pad"><div class="container"><div class="micro accent">НЕТ ГОТОВОГО БРИФА?</div><h2>Начните с того,<br>что уже есть.</h2><p>Пришлите сайт, материалы или короткое описание задачи. Поможем определить объём, формат и следующий шаг.</p>${link('/contact/', 'Обсудить проект')}</div></section>` });


const conceptWebOffer = ({ number, title, price, audience, scope, materials, revisions, included, note }) => `<article class="concept-offer concept-web-offer"><div class="concept-offer-id micro">${number} / 03</div><div class="concept-offer-header"><h3>${title}</h3><strong>${price}</strong></div><p>${audience}</p><details><summary>Состав и условия</summary><dl><div><dt>Объём</dt><dd>${scope}</dd></div><div><dt>Материалы</dt><dd>${materials}</dd></div><div><dt>Правки</dt><dd>${revisions}</dd></div></dl><ul>${included.map(item => `<li>${item}</li>`).join('')}</ul><small>${note}</small></details>${link('/contact/', 'Обсудить формат', 'concept-offer-link')}</article>`;
const conceptShortOffer = ({ title, price, description }, index, total) => `<article class="concept-offer"><div class="concept-offer-id micro">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div><div class="concept-offer-header"><h3>${title}</h3><strong>${price}</strong></div><p>${description}</p>${link('/contact/', 'Обсудить', 'concept-offer-link')}</article>`;
const conceptDeck = (offers, render = conceptShortOffer) => `<div class="concept-deck" data-concept-carousel><div class="concept-deck-bar"><span class="micro">ФОРМАТЫ РАБОТЫ / ${String(offers.length).padStart(2, '0')}</span>${offers.length > 1 ? '<div class="concept-deck-controls"><button type="button" data-concept-prev aria-label="Предыдущая услуга" disabled>←</button><button type="button" data-concept-next aria-label="Следующая услуга">→</button></div>' : ''}</div><div class="concept-offer-track" ${offers.length > 1 ? 'tabindex="0"' : ''} aria-label="Форматы работы">${offers.map((offer, index) => render(offer, index, offers.length)).join('')}</div>${offers.length > 1 ? '<span class="concept-swipe micro">ЛИСТАЙТЕ КАРТОЧКИ →</span>' : ''}</div>`;
const conceptChapter = ({ id, index, name, title, description, media, mediaAlt, mediaCaption, mediaHref, offerHtml, extra = '', dark = false, wedge = false }) => `<section class="concept-chapter ${dark ? 'concept-chapter-dark dark-section' : 'concept-chapter-paper light-section'}" id="${id}" aria-labelledby="concept-${id}-title"><div class="container concept-chapter-grid"><div class="concept-chapter-visual"><div class="concept-visual-frame ${wedge ? 'concept-visual-wedge' : ''}">${mediaHref ? `<a href="${mediaHref}" aria-label="Открыть проект ${mediaCaption}"><img src="${media}" alt="${mediaAlt}" loading="lazy" decoding="async"></a>` : `<img src="${media}" alt="${mediaAlt}" loading="lazy" decoding="async">`}</div><span class="micro">${mediaCaption}</span></div><div class="concept-chapter-content"><div class="concept-chapter-top micro"><span>${index} / 04</span><span>${name}</span></div><h2 id="concept-${id}-title">${title}<span class="punct">.</span></h2><p class="concept-chapter-lead">${description}</p>${offerHtml}${extra}</div></div></section>`;
const conceptBrandOffers = [...serviceGroups[0].offers, { title: 'Бренд + сайт', price: 'от 79 900 ₽', description: 'Базовая айдентика и сайт как одна визуальная система. Состав страниц и материалов определяем перед стартом.' }];
const servicesConcept = shell({
  title: 'Услуги — концепт', current: 'services', path: '/services-concept/', preview: true, bodyClass: 'services-concept',
  description: 'Экспериментальная версия страницы услуг TESSEN.',
  body: `<section class="concept-hero dark-section"><div class="container"><div class="concept-hero-meta micro"><span>УСЛУГИ / TESSEN</span><span>BRAND · DIGITAL · CONTENT</span></div><div class="concept-hero-main"><div class="concept-hero-copy"><span class="micro accent">СИСТЕМНЫЙ ДИЗАЙН ДЛЯ БИЗНЕСА</span><h1>СНАЧАЛА<br><em>СМЫСЛ.</em><br>ПОТОМ ФОРМА<span class="punct">.</span></h1><p>Сайт, бренд, контент и автоматизация. Выберите отправную точку — остальное соберём в систему.</p></div><div class="concept-reel" aria-hidden="true"><div><img src="/media/questcenter-1-1600.jpg" alt="" loading="eager"></div><div><img src="/media/pager-mobile-1600.jpg" alt="" loading="eager"></div><div><img src="/media/quest-hero-1-1600.jpg" alt="" loading="eager"></div><span>01 — 04 / TESSEN</span></div></div><nav class="concept-hero-nav" aria-label="Выбрать направление">${[['digital','01','Сайты','19 900 ₽'],['brand','02','Бренд','от 24 900 ₽'],['content','03','Контент','9 900 ₽'],['automation','04','Автоматизация','от 29 900 ₽']].map(([id,index,name,price])=>`<a href="#c-${id}"><span>${index}</span><strong>${name}</strong><small>${price}</small></a>`).join('')}</nav></div></section>
${conceptChapter({ id:'c-digital', index:'01', name:'DIGITAL', title:'Сайты', description:'Сравните объём, подготовку материалов и число раундов правок до выбора формата.', media:'/media/questcenter-1-1600.jpg', mediaAlt:'QUESTCENTER — платформа поиска и бронирования квестов', mediaCaption:'QUESTCENTER / DIGITAL', mediaHref:'/work/questcenter/', offerHtml:conceptDeck(webFormats,conceptWebOffer), extra:`<details class="concept-more"><summary><span>Сложные цифровые задачи</span><span>03 ${arrow}</span></summary><div>${webProjects.map((offer, index) => conceptShortOffer(offer, index, webProjects.length)).join('')}</div></details><p class="services-pricing-note">Цены в рублях. Для услуг с пометкой «от» итоговую стоимость определяем после обсуждения объёма работ.</p>` })}
${conceptChapter({ id:'c-brand', index:'02', name:'BRAND', title:'Бренд', description:serviceGroups[0].description, media:'/media/hero-brand-v3.webp', mediaAlt:'Визуальное направление QUESTCENTER / QUESTREQUEST', mediaCaption:'QUESTCENTER / BRAND', mediaHref:'/work/questcenter/', offerHtml:conceptDeck(conceptBrandOffers), dark:true, wedge:true })}
${conceptChapter({ id:'c-content', index:'03', name:'CONTENT', title:'Контент', description:serviceGroups[1].description, media:'/media/pager-mobile-1600.jpg', mediaAlt:'PAGER — визуальная система цифрового продукта', mediaCaption:'PAGER / CONTENT', mediaHref:'/work/pager/', offerHtml:conceptDeck(serviceGroups[1].offers) })}
${conceptChapter({ id:'c-automation', index:'04', name:'AUTOMATION', title:'Автоматизация', description:serviceGroups[2].description, media:'/media/hero-automation-v3.webp', mediaAlt:'Схема автоматизированного процесса', mediaCaption:'WORKFLOW / AUTOMATION', offerHtml:conceptDeck(serviceGroups[2].offers), dark:true, wedge:true })}
<section class="concept-end light-section section-pad"><div class="container concept-end-grid"><div><span class="micro accent">05 / ДОПОЛНИТЕЛЬНО</span><h2>Когда нужен больший объём<span class="punct">.</span></h2><p>Дополнительные страницы, варианты и технические задачи обсуждаем вместе с основным проектом.</p></div><div><details class="extras-disclosure"><summary><span>Дополнительные работы</span><span class="micro">10 ПОЗИЦИЙ</span></summary><div class="extras-list">${extras.map(([name, price]) => `<div class="extras-row"><span>${name}</span><strong>${price}</strong></div>`).join('')}</div></details>${link('/services/', 'Сравнить с текущей версией', 'concept-compare')}</div></div></section>
<section class="scope-note dark-section section-pad"><div class="container"><div class="micro accent">НЕТ ГОТОВОГО БРИФА?</div><h2>Начните с того,<br>что уже есть.</h2><p>Пришлите сайт, материалы или короткое описание задачи. Поможем определить объём, формат и следующий шаг.</p>${link('/contact/', 'Обсудить проект')}</div></section>`
});

const founderSection = `<section class="founder-section dark-section" aria-labelledby="founder-title"><div class="container founder-layout"><div class="founder-visual"><div class="founder-badge" data-founder-badge><div class="founder-portrait-frame"><img class="founder-photo" src="/media/about-founder-v2.webp" width="1086" height="1448" alt="Портрет Евгения, основателя TESSEN" loading="lazy" decoding="async"><span class="founder-photo-shade" aria-hidden="true"></span><span class="founder-glint" aria-hidden="true"></span><span class="founder-badge-index" aria-hidden="true">TESSEN <i></i> 01 / FOUNDER</span><span class="founder-badge-name" aria-hidden="true">ЕВГЕНИЙ<small>ОСНОВАТЕЛЬ СТУДИИ</small></span><span class="founder-frame-accent" aria-hidden="true"></span></div></div></div><div class="founder-copy"><div class="founder-kicker micro"><span class="accent">00 / ОСНОВАТЕЛЬ</span><span>ПРОЕКТЫ ВЕДУ ЛИЧНО</span></div><h2 id="founder-title"><span class="founder-years">20+</span> лет<br>в digital и бизнесе<span class="punct">.</span></h2><p>От собственных e-commerce-проектов и продуктовых сервисов — до сайтов, интерфейсов, айдентики и автоматизации.</p><p>В TESSEN отвечаю за стратегию, структуру, арт-дирекшн и конечный результат проекта.</p><div class="founder-signature micro"><span>СТРАТЕГИЯ / ДИЗАЙН / РЕАЛИЗАЦИЯ</span><span>TESSEN / СТУДИЯ</span></div></div></div></section>`;

const about = shell({ title: 'О студии', current: 'about', path: '/about/', description: 'TESSEN — независимая студия на стыке дизайна, digital и визуального контента.', body: `<section class="page-intro about-intro dark-section"><div class="container"><div class="page-eyebrow micro"><span class="accent">STUDIO / 004</span><span>КТО МЫ</span></div><h1>МЕНЬШЕ ШУМА<span class="punct">.</span><br>БОЛЬШЕ СМЫСЛА<span class="punct">.</span></h1><div class="intro-bottom"><p>TESSEN — независимая студия на стыке дизайна, digital и визуального контента.</p>${standaloneWordmark}</div></div></section>${founderSection}<section class="about-statement light-section section-pad"><div class="container about-grid"><div class="micro accent">01 / ПОДХОД</div><div><h2>Прямое участие<br>на каждом этапе.</h2><p>Проекты ведутся от постановки задачи и структуры до визуальной системы и запуска. В основе подхода — опыт работы с цифровыми продуктами, сайтами и коммерческими задачами.</p><p>Сначала разбираемся, зачем решение нужно людям и бизнесу. Затем собираем форму, которая выдержит реальное использование.</p></div></div></section><section class="about-principles dark-section section-pad"><div class="container">${sectionHead('02', 'PRINCIPLES', 'Как устроена работа.')}<div class="principles-grid">${[['01','Напрямую','Без лишнего слоя между задачей и тем, кто её решает.'],['02','Системно','От отдельного экрана до целостного языка бренда.'],['03','Практично','Дизайн должен быть готов к производству и использованию.'],['04','Внимательно','Детали важны, когда они помогают целому.']].map(([n,t,d])=>`<div><span class="micro accent">${n}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></section><section class="about-bridge light-section section-pad"><div class="container"><div class="micro accent">BRAND · DIGITAL · CONTENT</div><p>Ищем точку, где ясная структура, сильный образ и работающий результат становятся одним проектом.</p>${link('/work/', 'Смотреть работы')}</div></section>` });

const contact = shell({ title: 'Контакт', current: 'contact', path: '/contact/', description: 'Обсудить бренд, сайт, цифровой продукт или визуальный контент с TESSEN. Почта, телефон и Telegram для связи.', body: `<section class="contact-hero dark-section"><div class="container"><div class="page-eyebrow micro"><span class="accent">CONTACT / 005</span><span>НАЧНЁМ С РАЗГОВОРА</span></div><h1>ЕСТЬ ЗАДАЧА<span class="accent">?</span><br><em>РАССКАЖИТЕ<span class="punct">.</span></em></h1><div class="contact-grid"><div><p>Расскажите о проекте в нескольких строках или пришлите материалы. Уточним формат работы и следующий шаг.</p><details class="contact-prompts"><summary class="micro">С ЧЕГО НАЧАТЬ ПИСЬМО</summary><ol><li>Что нужно создать или изменить?</li><li>Для кого предназначен проект?</li><li>Какие сроки и материалы уже есть?</li></ol></details></div><div class="contact-actions"><div class="contact-actions-heading micro"><span class="accent">ПРЯМАЯ СВЯЗЬ</span><span>ПОЧТА / ТЕЛЕФОН / ТЕЛЕГРАМ</span></div><div class="contact-methods-page"><div class="contact-email-group">${contactMethod('ПОЧТА', email, `mailto:${email}?subject=${encodeURIComponent('Проект для TESSEN')}`)}<button class="copy-email" type="button" data-copy="${email}" aria-live="polite">Скопировать адрес <span aria-hidden="true">↗</span></button></div>${contactMethod('ТЕЛЕФОН', phoneLabel, `tel:${phone}`)}${contactMethod('ТЕЛЕГРАМ', '@EvgenyM82', telegram, ' target="_blank" rel="noopener noreferrer"')}</div></div></div></div></section>` });

function write(path, html) {
  for (const locale of locales) {
    const route = localizedPath(locale, path);
    const local = route === '/' ? 'index.html' : `${route.slice(1)}index.html`;
    mkdirSync(local.split('/').slice(0, -1).join('/') || '.', { recursive: true });
    writeFileSync(local, localizeHtml(html, locale, path, origin, routes));
  }
}
write('/', home);
write('/work/', work);
projects.forEach((project, i) => write(`/work/${project.slug}/`, casePage(project, projects[(i+1) % projects.length])));
write('/services/', services);
write('/services-concept/', servicesConcept);
write('/about/', about);
write('/contact/', contact);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
if (origin) writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locales.flatMap(locale => routes.map(path=>`<url><loc>${origin}${localizedPath(locale, path)}</loc></url>`)).join('')}</urlset>`);
else rmSync('sitemap.xml', { force: true });
