const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

function loadShared(initial = {}) {
  const store = structuredClone(initial);
  const context = {
    console, TextEncoder, Uint8Array, Date, Math, Map, Set, Promise, Blob, URL,
    crypto: webcrypto,
    btoa: value => Buffer.from(value, 'binary').toString('base64'),
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    chrome: {
      storage: { local: {
        get: async key => typeof key === 'string' ? { [key]: store[key] } : structuredClone(store),
        set: async values => Object.assign(store, structuredClone(values))
      } },
      runtime: { getManifest: () => ({ version: '1.3.2' }) }
    },
    globalThis: null
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('clipnote_v1.3.2/shared.js', 'utf8'), context);
  return { ClipNote: context.ClipNote, store };
}

test('strictly parses release versions', () => {
  const { ClipNote } = loadShared();
  assert.equal(ClipNote.normalizeVersionString('v1.3.2'), '1.3.2');
  assert.equal(ClipNote.normalizeVersionString('foo1.3.2bar'), '');
  assert.equal(ClipNote.normalizeVersionString('1.3'), '');
});

test('markdown escapes code once and blocks unsafe links', () => {
  const { ClipNote } = loadShared();
  const code = ClipNote.parseMarkdown('```html\n<div>x</div>\n```');
  assert.match(code, /&lt;div&gt;x&lt;\/div&gt;/);
  assert.doesNotMatch(code, /&amp;lt;/);
  assert.doesNotMatch(ClipNote.parseMarkdown('[x](javascript:alert(1))'), /href=/);
});

test('markdown renders nested lists as children of list items', () => {
  const { ClipNote } = loadShared();
  assert.match(ClipNote.parseMarkdown('- parent\n  - child'), /<li>parent<ul><li>child<\/li><\/ul><\/li>/);
});

test('migration tolerates null records and de-duplicates ids', async () => {
  const { ClipNote, store } = loadShared({
    clipnote_notes: [null, { id: 'same', content: 'old' }, { id: 'same', content: 'new' }],
    clipnote_workspaces: [null, { id: 'ws_default', name: 'General' }, { id: 'ws_default', name: 'Duplicate' }],
    clipnote_settings: {}, clipnote_categories: ['Work'], clipnote_custom_tags: []
  });
  const migrated = await ClipNote.migrateStorageData();
  assert.equal(migrated.notes.length, 1);
  assert.equal(migrated.workspaces.length, 1);
  assert.equal(store.clipnote_notes.length, 1);
});
