import { readFileSync, writeFileSync } from 'node:fs';

const artwork = readFileSync('Assets/Logo/fan.svg', 'utf8');
const marker = '  </defs>';
if (!artwork.includes(marker)) throw new Error('Fan SVG has no definitions block');
const favicon = artwork.replace(marker, `${marker}\n  <rect width="512" height="512" fill="#0a0a0a"/>`);
writeFileSync('favicon.svg', favicon);
