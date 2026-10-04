// Isolierter Logiktest: kein echter Browser, keine Grafik-/Geräteprüfung.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, process.argv[2] || 'index.html'), 'utf8');
const elements = new Map();
const context2d = new Proxy({
  measureText: text => ({ width: text.length * 6 }),
  getImageData: (_, __, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) })
}, { get: (obj, key) => key in obj ? obj[key] : () => {} });
for (const match of html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*\bid="([^"]+)"[^>]*)>/gi)) {
  const [, tag, attrs, id] = match;
  const listeners = {};
  const element = {
    value: attrs.match(/\bvalue="([^"]*)"/)?.[1] || '',
    type: attrs.match(/\btype="([^"]*)"/)?.[1] || tag,
    checked: /\bchecked\b/.test(attrs), hidden: /\bhidden\b/.test(attrs),
    dataset: {}, style: {}, textContent: '', width: 800, height: 400,
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute() {}, focus() {}, getContext: () => context2d,
    getBoundingClientRect: () => ({ width: 800, height: 400 }),
    addEventListener: (event, fn) => { (listeners[event] ||= []).push(fn); },
    fire: (event, args = {}) => { for (const fn of listeners[event] || []) fn({ target: element, stopPropagation() {}, preventDefault() {}, ...args }); }
  };
  if (tag === 'textarea') element.value = html.slice(match.index + match[0].length).split('</textarea>')[0];
  if (tag === 'select') {
    const options = html.slice(match.index + match[0].length).split('</select>')[0];
    element.value = options.match(/<option[^>]*value="([^"]+)"[^>]*selected/)?.[1] || options.match(/<option[^>]*value="([^"]+)"/)?.[1] || '';
  }
  element.defaultValue = element.value;
  elements.set(id, element);
}
const get = id => { assert.ok(elements.has(id), `DOM-Ziel vorhanden: ${id}`); return elements.get(id); };
let nextFrame = 0;
const frames = new Map();
const saved = new Map();
const sandbox = {
  console, URL, Uint8ClampedArray,
  document: { getElementById: get, documentElement: {}, visibilityState: 'visible', querySelector: () => ({}), querySelectorAll: () => [], addEventListener() {}, createElement: () => ({ getContext: () => context2d }) },
  window: { devicePixelRatio: 1, addEventListener() {} }, screen: {}, navigator: {},
  localStorage: { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value) },
  setTimeout: () => 1, clearTimeout() {},
  requestAnimationFrame: callback => { const id = ++nextFrame; frames.set(id, callback); return id; },
  cancelAnimationFrame: id => frames.delete(id)
};
vm.createContext(sandbox);
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) vm.runInContext(match[1], sandbox, { timeout: 5000 });
const dictionaries = html.match(/const translations = ([\s\S]*?);\n    translations.ja = ([^\n]*);/);
assert.ok(dictionaries, 'Sprachwörterbücher vorhanden');
const languages = vm.runInNewContext('(' + dictionaries[1] + ')');
const japanese = JSON.parse(dictionaries[2]);
assert.equal(Object.keys(languages.en).filter(key => !japanese[key]).length, 0, 'Japanische Übersetzung vollständig');
const tick = timestamp => { const entries = [...frames]; frames.clear(); for (const [, callback] of entries) callback(timestamp); };
get('keepAwake').checked = false;
get('creditEnabled').checked = false;
get('messages').value = 'Hallo Matrix\nEine lange Testzeile für den Lauftext';
get('startButton').fire('click');
assert.equal(get('display').hidden, false);
assert.equal(frames.size, 1);
tick(1000); tick(1100);
assert.equal(frames.size, 1);
get('pauseButton').fire('click');
assert.equal(get('pauseButton').textContent, '▶');
get('pauseButton').fire('click');
get('themeButton').fire('click');
assert.equal(get('displayTheme').value, 'paper');
get('editButton').fire('click');
assert.equal(get('editor').hidden, false);
assert.equal(frames.size, 0, 'Stop entfernt geplanten Animationsframe');
get('startButton').fire('click'); get('startButton').fire('click');
assert.equal(frames.size, 1, 'Doppelstart erzeugt nur eine Schleife');
get('editButton').fire('click');
get('messages').value = '';
get('qrContent').value = '';
get('startButton').fire('click');
assert.equal(get('display').hidden, true, 'Leerer Inhalt startet nicht');
get('qrContent').value = 'https://example.org';
get('startButton').fire('click'); tick(1200);
assert.equal(get('display').hidden, false, 'QR-only startet');
assert.equal(frames.size, 1);
get('editButton').fire('click');
get('language').value = 'en'; get('language').fire('change');
assert.equal(sandbox.document.documentElement.lang, 'en');
get('language').value = 'ja'; get('language').fire('change');
assert.equal(sandbox.document.documentElement.lang, 'ja');
assert.equal(get('startButton').textContent, '表示を開始 ↗');
get('messages').value = 'こんにちは\n音楽と友情';
get('startButton').fire('click'); tick(1300);
assert.equal(get('display').hidden, false, 'Japanischer Text startet');
get('editButton').fire('click');
assert.ok(saved.size > 0, 'Einstellungen werden gespeichert');
get('messages').value = 'Vollbild-Test';
let fullEntries = 0, fullExits = 0;
get('display').requestFullscreen = () => { fullEntries++; sandbox.document.fullscreenElement = get('display'); return Promise.resolve(); };
sandbox.document.exitFullscreen = () => { fullExits++; sandbox.document.fullscreenElement = null; return Promise.resolve(); };
get('startButton').fire('click');
assert.equal(fullEntries, 1, 'Start fordert Vollbild automatisch an');
get('fullscreenButton').fire('click');
assert.equal(fullExits, 1, 'Vollbildschalter verlässt Vollbild');
assert.equal(get('display').hidden, false, 'Anzeige läuft im normalen Fenster weiter');
assert.equal(frames.size, 1, 'Vollbildwechsel unterbricht Animation nicht');
get('fullscreenButton').fire('click');
assert.equal(fullEntries, 2, 'Vollbildschalter aktiviert Vollbild erneut');
console.log('OK: Initialisierung, Text, Pause, Theme, Stop/Restart, Doppelstart, Leerprüfung, QR-only, Sprache, Speicherung, Vollbildwechsel in beide Richtungen.');
console.log('Grenze: DOM/Canvas simuliert; kein visueller Test, kein QR-Scan, keine echte Vollbild-/Wake-Lock-Prüfung.');
