import { visualGallery } from './tramp-case.mjs';

const familyFrames = [
  ['001', 'Родители рядом с малышом в плетёной колыбели L.PAOLETTI на террасе', 'Семья / первые дни'],
  ['002', 'Мама смотрит на малыша в колыбели L.PAOLETTI под балдахином', 'Колыбель / терраса'],
  ['006', 'Мама сидит рядом с колыбелью и малышом в светлой комнате', 'Колыбель / рядом'],
  ['007', 'Мама склоняется над малышом в колыбели в детской комнате', 'Колыбель / забота'],
  ['005', 'Плетёная колыбель L.PAOLETTI в детской комнате с розовыми акцентами', 'Колыбель / детская'],
  ['008', 'Колыбель L.PAOLETTI в светлой детской комнате', 'Колыбель / интерьер'],
  ['009', 'Колыбель L.PAOLETTI рядом с кроватью в спальне', 'Колыбель / спальня'],
];

const detailFrames = [
  ['003', 'Руки мастера работают над плетением колыбели L.PAOLETTI', 'Плетение / процесс'],
  ['004', 'Плетёная колыбель L.PAOLETTI на нейтральном фоне', 'Колыбель / форма'],
  ['010', 'Колыбель и другие предметы детской комнаты L.PAOLETTI в интерьере', 'Мебель / композиция'],
];

const dimensions = { '001': [724, 543], '002': [724, 543], '003': [627, 627], '004': [627, 627], '010': [836, 470], hero: [836, 470] };
const photo = (number, alt, eager = false) => {
  const [width, height] = dimensions[number] || [767, 512];
  const name = number === 'hero' ? 'Hero_img.webp' : `lpaul-${number}.webp`;
  return `<img src="/Assets/LPAOLETTI/${name}" width="${width}" height="${height}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
};

export const lpaolettiTeaserVisual = `<span class="tramp-teaser-triptych" aria-hidden="true">${['001', '003', '010'].map(number => photo(number, '')).join('')}</span>`;

export function lpaolettiCaseBody(next, arrow, total) {
  return `<article class="tramp-case lpaoletti-case">
    <section class="tramp-hero dark-section"><div class="container">
      <div class="tramp-breadcrumb micro"><a href="/work/">РАБОТЫ</a><span>/</span><span>06 / ${String(total).padStart(2, '0')}</span><span>CONTENT</span></div>
      <div class="tramp-hero-grid"><div class="tramp-hero-copy">
        <span class="micro accent">ВИЗУАЛЬНЫЙ КОНТЕНТ / L.PAOLETTI</span>
        <h1>L.PAOLETTI<span class="punct">.</span></h1>
        <p>Тепло ручной работы.</p>
        <div class="tramp-hero-bottom"><span class="micro">ОКОЛО 15 ВИЗУАЛОВ</span><a href="#lpaoletti-series">Смотреть подборку ↓</a></div>
      </div><div class="tramp-hero-image">${photo('hero', 'Плетёная колыбель L.PAOLETTI на тёмно-зелёном фоне', true)}<span class="micro">01 / 11 · КОЛЫБЕЛЬ</span></div></div>
    </div></section>
    <section class="tramp-statement light-section"><div class="container">
      <div class="tramp-statement-label micro"><span class="accent">01 / МАСШТАБ</span><span>L.PAOLETTI / ВИЗУАЛЬНЫЙ КОНТЕНТ</span></div>
      <div class="tramp-statement-grid"><div class="tramp-stat"><strong>≈15</strong><span>визуалов для нескольких продуктов</span></div><div class="tramp-statement-copy">
        <h2>Близко к жизни<br>и к деталям<span class="punct">.</span></h2>
        <p>Для производителя детской мебели ручной работы L.PAOLETTI создана серия визуалов. В этой подборке колыбель показана рядом с семьёй, в интерьере и через детали плетения.</p>
        <span class="micro">НА ЭТОЙ СТРАНИЦЕ — ЧАСТЬ СЕРИИ</span>
      </div></div>
    </div></section>
    <div class="tramp-series light-section" id="lpaoletti-series">
      ${visualGallery({ id: 'lpaoletti-family', number: '02', label: 'В ИНТЕРЬЕРЕ', title: 'Рядом с семьёй', description: 'Колыбель в детской, спальне и повседневных моментах.', frames: familyFrames, renderPhoto: photo })}
      ${visualGallery({ id: 'lpaoletti-details', number: '03', label: 'ДЕТАЛИ', title: 'Форма и плетение', description: 'Предметный взгляд на материал, конструкцию и окружение.', frames: detailFrames, renderPhoto: photo })}
    </div>
    <section class="tramp-end dark-section"><div class="container"><div class="tramp-end-grid"><span class="micro accent">04 / РЕЗУЛЬТАТ</span><div><p>11 кадров из серии примерно в 15 визуалов.</p><a href="/contact/">Обсудить визуалы ${arrow}</a></div></div></div></section>
    <a class="next-project" href="/work/${next.slug}/"><div class="container"><span class="micro">СЛЕДУЮЩИЙ ПРОЕКТ / ${next.index}</span><span>${next.title}${arrow}</span></div></a>
  </article>`;
}
