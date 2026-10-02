import { visualGallery } from './tramp-case.mjs';

const pavilionFrames = [
  ['010', 'Павильон МИТЕК в цветущем саду у воды', 'Павильон / у воды'],
  ['009', 'Павильон МИТЕК для праздника у бассейна', 'Павильон / праздник'],
  ['008', 'Компания за столом под павильоном МИТЕК на пляже', 'Павильон / встреча'],
  ['007', 'Женщина накрывает стол под павильоном в лесу', 'Павильон / отдых'],
  ['006', 'Открытый павильон МИТЕК на песчаном берегу', 'Павильон / пространство'],
  ['005', 'Павильон МИТЕК среди цветущих деревьев', 'Павильон / сад'],
  ['012', 'Закрытый павильон МИТЕК на лесной поляне', 'Павильон / форма'],
  ['013', 'Большой павильон МИТЕК у воды осенью', 'Павильон / сезон'],
];

const gearFrames = [
  ['004', 'Мужчина с сумкой МИТЕК у водопада', 'Сумка / маршрут'],
  ['003', 'Рыба в сумке МИТЕК у водоёма', 'Сумка / рыбалка'],
  ['002', 'Сумка МИТЕК с грибами в лесу', 'Сумка / лес'],
  ['001', 'Зелёная сумка МИТЕК с грибами', 'Сумка / детали'],
];

const photo = (number, alt, eager = false) => {
  const portrait = Number(number) <= 4;
  const extension = portrait ? 'webp' : 'jpg';
  return `<img src="/Assets/MITEK/mitek-${number}.${extension}" width="${portrait ? 720 : 1920}" height="${portrait ? 960 : 1920}" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
};

export const mitekTeaserVisual = `<span class="tramp-teaser-triptych" aria-hidden="true">${['005', '011', '004'].map(number => photo(number, '')).join('')}</span>`;

export function mitekCaseBody(next, arrow, total) {
  return `<article class="tramp-case mitek-case">
    <section class="tramp-hero dark-section"><div class="container">
      <div class="tramp-breadcrumb micro"><a href="/work/">РАБОТЫ</a><span>/</span><span>05 / ${String(total).padStart(2, '0')}</span><span>CONTENT</span></div>
      <div class="tramp-hero-grid"><div class="tramp-hero-copy">
        <span class="micro accent">ВИЗУАЛЬНЫЙ КОНТЕНТ / МИТЕК</span>
        <h1>МИТЕК<span class="punct">.</span></h1>
        <p>Продукт в живой среде.</p>
        <div class="tramp-hero-bottom"><span class="micro">ОКОЛО 60 ВИЗУАЛОВ</span><a href="#mitek-series">Смотреть подборку ↓</a></div>
      </div><div class="tramp-hero-image">${photo('011', 'Две женщины отдыхают под павильоном МИТЕК в цветущем саду', true)}<span class="micro">01 / 13 · ПАВИЛЬОН</span></div></div>
    </div></section>
    <section class="tramp-statement light-section"><div class="container">
      <div class="tramp-statement-label micro"><span class="accent">01 / МАСШТАБ</span><span>МИТЕК / ВИЗУАЛЬНЫЙ КОНТЕНТ</span></div>
      <div class="tramp-statement-grid"><div class="tramp-stat"><strong>≈60</strong><span>визуалов для производителя</span></div><div class="tramp-statement-copy">
        <h2>От павильона<br>до детали<span class="punct">.</span></h2>
        <p>Для производителя МИТЕК создана серия визуалов: павильоны в разных условиях отдыха, сумки в поездке, на рыбалке и в лесу.</p>
        <span class="micro">НА ЭТОЙ СТРАНИЦЕ — ЧАСТЬ СЕРИИ</span>
      </div></div>
    </div></section>
    <div class="tramp-series light-section" id="mitek-series">
      ${visualGallery({ id: 'mitek-pavilions', number: '02', label: 'ПАВИЛЬОНЫ', title: 'Пространство для отдыха', description: 'Один продукт — разные места, свет и сценарии использования.', frames: pavilionFrames, renderPhoto: photo })}
      ${visualGallery({ id: 'mitek-gear', number: '03', label: 'СУМКИ', title: 'С собой на природу', description: 'Предметные кадры в дороге, у воды и в лесу.', frames: gearFrames, renderPhoto: photo })}
    </div>
    <section class="tramp-end dark-section"><div class="container"><div class="tramp-end-grid"><span class="micro accent">04 / РЕЗУЛЬТАТ</span><div><p>13 кадров из серии примерно в 60 визуалов.</p><a href="/contact/">Обсудить визуалы ${arrow}</a></div></div></div></section>
    <a class="next-project" href="/work/${next.slug}/"><div class="container"><span class="micro">СЛЕДУЮЩИЙ ПРОЕКТ / ${next.index}</span><span>${next.title}${arrow}</span></div></a>
  </article>`;
}
