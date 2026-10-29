const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
// Transpile the actual adapter in memory; no browser or fixture catalog is shipped.
function load(file) {
  const filename = path.resolve(__dirname, '../src/lib', file + '.ts');
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = module.paths;
  const original = mod.require.bind(mod);
  mod.require = id => id === './api' ? load('api') : original(id);
  mod._compile(compiled, filename);
  return mod.exports;
}
const { mapProduct, cartItem, safeLink, mediaUrl } = load('storefront');
const raw = { id: 'product-1', slug: 'test', title: 'Test', description: '<p>Description</p>', collection_ids: ['a', 'b'], tags: ['featured', 'bestseller', 'new-arrival'], images: [{ url: '/storage/new.jpg' }], variants: [
  { id: 'sold-out', title: 'Small', price: 100, inventory_quantity: 0 },
  { id: 'available', title: 'Large', price: 150, compare_at_price: 200, inventory_quantity: 2 },
] };
test('catalog preserves database identity, all categories, flags and available variant pricing', () => {
  const p = mapProduct(raw, [{ id: 'a', slug: 'first' }, { id: 'b', slug: 'second' }]);
  assert.equal(p.id, 'product-1'); assert.deepEqual(p.categorySlugs, ['first', 'second']);
  assert.equal(p.price, 150); assert.equal(p.variantId, 'available'); assert.equal(p.detail, 'Description');
  assert.equal(p.featured, true); assert.equal(p.tag, 'Bestseller'); assert.equal(p.isNew, true);
  assert.match(p.image, /\/storage\/new.jpg$/);
});
test('cart uses real selected variant and refuses missing or sold-out variants', () => {
  const p = mapProduct(raw, []);
  assert.equal(cartItem(p).variant_id, 'available'); assert.equal(cartItem(p).price, 150);
  assert.equal(cartItem(p, 'sold-out'), null); assert.equal(cartItem(p, 'missing'), null);
  assert.equal(mapProduct({ ...raw, variants: [] }, []).inStock, false);
});
test('media and links preserve relative storefront assets and reject executable links', () => {
  assert.equal(mediaUrl('/assets/hd/test.webp'), '/assets/hd/test.webp');
  assert.equal(safeLink('javascript:alert(1)'), '/shop'); assert.equal(safeLink('//example.test'), '/shop');
  assert.equal(safeLink('/collections/test'), '/collections/test');
});
