const summerFrames = [
  ['08', 'Туристка с рюкзаком и трекинговыми палками на горной тропе', 'Маршрут / движение'],
  ['07', 'Термос TRAMP в руке на лесной тропе', 'Термос / в пути'],
  ['06', 'Линейка термосов TRAMP на траве в лесу', 'Термосы / серия'],
  ['04', 'Гермомешки TRAMP в прозрачной воде', 'Гермомешки / вода'],
  ['05', 'Водозащитные чехлы с вещами на каменистом дне', 'Чехлы / детали'],
  ['02', 'Туристический коврик TRAMP на траве', 'Коврик / отдых'],
  ['03', 'Двое отдыхают на туристическом коврике среди травы', 'Коврик / масштаб'],
];

const winterFrames = [
  ['10', 'Туристы с лопатами на снежном склоне', 'Лопаты / в действии'],
  ['12', 'Крупный план лопаты в снегу на фоне гор', 'Лопата / деталь'],
  ['11', 'Пара снегоступов на горном снегу', 'Снегоступы / снег'],
  ['13', 'Зимняя рыбалка рядом с синими палатками на льду', 'Палатки / лёд'],
  ['09', 'Лопата в снегу на фоне вертолёта и гор', 'Лопата / экспедиция'],
];

const photo = (number, alt, eager = false) => `<img src="/Assets/TRAMP/tramp-${number}.webp" width="720" height="960" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;

export const visualGallery = ({ id, number, label, title, description, frames, renderPhoto = photo }) => `<section class="tramp-chapter" aria-labelledby="${id}-title" data-tramp-gallery><div class="container"><div class="tramp-chapter-head"><div><span class="micro accent">${number} / ${label}</span><h2 id="${id}-title">${title}<span class="punct">.</span></h2><p>${description}</p></div><div class="tramp-chapter-nav"><span class="micro"><strong data-tramp-current>01</strong> / ${String(frames.length).padStart(2, '0')}</span><button type="button" data-tramp-prev aria-label="Предыдущий кадр" aria-controls="${id}-track" disabled>←</button><button type="button" data-tramp-next aria-label="Следующий кадр" aria-controls="${id}-track">→</button></div></div></div><div class="tramp-track-wrap"><div class="tramp-track" id="${id}-track" role="region" aria-label="${title}" tabindex="0">${frames.map(([image, alt, caption], index) => `<figure class="tramp-frame">${renderPhoto(image, alt)}<figcaption><span class="micro">${String(index + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')}</span><span>${caption}</span></figcaption></figure>`).join('')}</div></div><div class="container"><p class="tramp-swipe micro">ЛИСТАЙТЕ КАДРЫ →</p></div></section>`;

export const trampTeaserVisual = `<span class="tramp-teaser-triptych" aria-hidden="true">${['08', '04', '10'].map(number => photo(number, '')).join('')}</span>`;

export function trampCaseBody(next, arrow, total) {
  return `<article class="tramp-case"><section class="tramp-hero dark-section"><div class="container"><div class="tramp-breadcrumb micro"><a href="/work/">РАБОТЫ</a><span>/</span><span>04 / ${String(total).padStart(2, '0')}</span><span>CONTENT</span></div><div class="tramp-hero-grid"><div class="tramp-hero-copy"><span class="micro accent">ВИЗУАЛЬНЫЙ КОНТЕНТ / TRAMP</span><h1>TRAMP<span class="punct">.</span></h1><p>Снаряжение в движении.</p><div class="tramp-hero-bottom"><span class="micro">ОКОЛО 150 ВИЗУАЛОВ</span><a href="#tramp-series">Смотреть подборку ↓</a></div></div><div class="tramp-hero-image">${photo('01', 'Турист с рюкзаком на лесной тропе', true)}<span class="micro">01 / 13 · МАРШРУТ</span></div></div></div></section><section class="tramp-statement light-section"><div class="container"><div class="tramp-statement-label micro"><span class="accent">01 / МАСШТАБ</span><span>TRAMP / ВИЗУАЛЬНЫЙ КОНТЕНТ</span></div><div class="tramp-statement-grid"><div class="tramp-stat"><strong>≈150</strong><span>визуалов для разных задач</span></div><div class="tramp-statement-copy"><h2>Снаряжение<br>в своей среде<span class="punct">.</span></h2><p>Для российской компании TRAMP визуалы показывают снаряжение в разных ситуациях: от маршрута и отдыха у воды до снега и льда.</p><span class="micro">НА ЭТОЙ СТРАНИЦЕ — ЧАСТЬ СЕРИИ</span></div></div></div></section><div class="tramp-series light-section" id="tramp-series">${visualGallery({ id: 'tramp-summer', number: '02', label: 'МАРШРУТ', title: 'В движении и на привале', description: 'Снаряжение рядом с человеком, в ландшафте и в деталях.', frames: summerFrames })}${visualGallery({ id: 'tramp-winter', number: '03', label: 'СНЕГ И ЛЁД', title: 'В холоде', description: 'Другой свет, другой масштаб, те же предметные задачи.', frames: winterFrames })}</div><section class="tramp-end dark-section"><div class="container"><div class="tramp-end-grid"><span class="micro accent">04 / РЕЗУЛЬТАТ</span><div><p>13 кадров из серии примерно в 150 визуалов.</p><a href="/contact/">Обсудить визуалы ${arrow}</a></div></div></div></section><a class="next-project" href="/work/${next.slug}/"><div class="container"><span class="micro">СЛЕДУЮЩИЙ ПРОЕКТ / ${next.index}</span><span>${next.title}${arrow}</span></div></a></article>`;
}
