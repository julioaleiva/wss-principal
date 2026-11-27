import fs from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname;
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalogo.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const categories = catalog.categories;
const systems = catalog.systems;
const quienSoyVisible = catalog.quiensoy_visible;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function escapeHTML(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
function jsJSON(value) {
  return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');
}
function replaceRegion(text, start, end, content) {
  const from = text.indexOf(start);
  const to = text.indexOf(end, from + start.length);
  assert(from >= 0 && to > from, `Missing generated region: ${start}`);
  assert(text.indexOf(start, from + 1) < 0, `Duplicate generated region: ${start}`);
  return text.slice(0, from + start.length) + '\n' + content + '\n' + text.slice(to);
}
function applyVisibility(text, name, visible) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const from = text.indexOf(start);
  const to = text.indexOf(end, from + start.length);
  assert(from >= 0 && to > from, `Missing visibility region: ${name}`);
  assert(text.indexOf(start, from + 1) < 0, `Duplicate visibility region: ${name}`);
  return text.slice(0, from) + (visible ? text.slice(from + start.length, to) : '') + text.slice(to + end.length);
}

assert(typeof quienSoyVisible === 'boolean', 'quiensoy_visible must be true or false');
assert(categories && typeof categories === 'object', 'categories must be an object');
assert(Array.isArray(systems) && systems.length > 0, 'systems must be a nonempty array');
const categoryIds = Object.keys(categories);
const seen = new Set();
for (const [id, labels] of Object.entries(categories)) {
  assert(/^[a-z0-9-]+$/.test(id), `Invalid category id: ${id}`);
  assert(labels?.es && labels?.en, `Missing category translations: ${id}`);
}
for (const system of systems) {
  assert(/^[a-z0-9-]+$/.test(system.id), `Invalid system id: ${system.id}`);
  assert(!seen.has(system.id), `Duplicate system id: ${system.id}`);
  seen.add(system.id);
  assert(categoryIds.includes(system.category), `Unknown category for ${system.id}`);
  for (const language of ['es', 'en']) {
    assert(system.name?.[language] && system.description?.[language], `Missing ${language} text for ${system.id}`);
    assert(Array.isArray(system.tags?.[language]), `Missing ${language} tags for ${system.id}`);
  }
  assert(['idea', 'live', 'beta', 'soon'].includes(system.status), `Invalid status for ${system.id}`);
  assert(!system.url || /^https:\/\//.test(system.url), `Only HTTPS URLs are allowed for ${system.id}`);
  assert(system.status !== 'live' || system.url, `Live system needs a URL: ${system.id}`);
}

const inlineCategories = Object.fromEntries(categoryIds.map(id => [id, {id, label: categories[id].es, labelEn: categories[id].en}]));
const inlineSystems = systems.map(system => ({
  id: system.id, name: system.name.es, category: system.category,
  description: system.description.es, url: system.url || null,
  status: system.status, tags: system.tags.es, icon: system.icon,
}));
const englishSystems = Object.fromEntries(systems.map(system => [system.id, {
  name: system.name.en, description: system.description.en, tags: system.tags.en,
}]));
const cards = systems.map(system => {
  const live = Boolean(system.url) && system.status !== 'soon';
  const link = live
    ? `<a class="system-card__link" href="${escapeHTML(system.url)}" target="_blank" rel="noopener noreferrer">Abrir sitio</a>`
    : '';
  return `          <article class="system-card ${live ? 'is-live' : 'is-idea'}" data-category="${escapeHTML(system.category)}">
            <div class="system-card__top"><div class="system-card__icon" aria-hidden="true">${escapeHTML(system.icon || '◆')}</div>${live ? '<span class="system-card__badge is-live">En vivo</span>' : ''}</div>
            <h3>${escapeHTML(system.name.es)}</h3>
            <p>${escapeHTML(system.description.es)}</p>
            <div class="system-card__footer"><div class="system-card__tags"><span>${escapeHTML(categories[system.category].es)}</span></div>${link}</div>
          </article>`;
}).join('\n');
const options = categoryIds.map(id => `              <option value="${escapeHTML(categories[id].es)}">${escapeHTML(categories[id].es)}</option>`).join('\n');
let output = source;
output = replaceRegion(output, '<!-- catalog-cards:start -->', '<!-- catalog-cards:end -->',
  `        <div class="systems__grid" id="systemsGrid" aria-live="polite">\n${cards}\n        </div>`);
output = replaceRegion(output, '<!-- catalog-options:start -->', '<!-- catalog-options:end -->',
  `            <select id="rubro" name="rubro" required>\n              <option value="" disabled selected>Seleccioná un rubro</option>\n${options}\n              <option value="Otro / A medida">Otro / A medida</option>\n            </select>`);
output = replaceRegion(output, '// catalog-data:start', '// catalog-data:end',
  `const CATEGORIES = ${jsJSON(inlineCategories)};\n\nconst SYSTEMS = ${jsJSON(inlineSystems)};\n\nwindow.WSS = { CATEGORIES, SYSTEMS };`);
output = replaceRegion(output, '// catalog-english:start', '// catalog-english:end',
  `const EN_SYSTEMS = ${jsJSON(englishSystems)};`);
const textMatch = output.match(/const EN_TEXT = (\{[\s\S]*?\});\r?\n\/\/ catalog-english:start/);
assert(textMatch, 'English interface translations not found');
const interfaceText = JSON.parse(textMatch[1]);
for (const labels of Object.values(categories)) interfaceText[labels.es] = labels.en;
output = output.replace(textMatch[0], `const EN_TEXT = ${jsJSON(interfaceText)};\n// catalog-english:start`);
for (const name of ['quiensoy-nav', 'quiensoy-section', 'quiensoy-footer']) {
  output = applyVisibility(output, name, quienSoyVisible);
}
const target = path.join(root, 'dist');
fs.mkdirSync(target, {recursive: true});
fs.writeFileSync(path.join(target, 'index.html'), output, 'utf8');
fs.copyFileSync(path.join(root, 'preview.png'), path.join(target, 'preview.png'));
console.log(`Generated ${systems.length} systems in ${categoryIds.length} categories`);

