import assert from 'node:assert/strict';
import test from 'node:test';
import { parseGid } from './parseGid.ts';

// Cases adapted from Shopify Hydrogen's parse-gid.test.ts:
// https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/core/utils/parse-gid.test.ts
test('parses a standard Shopify GID', () => {
  const result = parseGid('gid://shopify/Product/123');
  assert.equal(result.id, '123');
  assert.equal(result.resource, 'Product');
  assert.equal(result.resourceId, '123');
});

test('parses a Shop GID', () => {
  const result = parseGid('gid://shopify/Shop/456');
  assert.equal(result.id, '456');
  assert.equal(result.resource, 'Shop');
});

test('parses a Cart GID with alphanumeric id', () => {
  const result = parseGid('gid://shopify/Cart/abc123');
  assert.equal(result.id, 'abc123');
  assert.equal(result.resource, 'Cart');
});

test('returns empty defaults for undefined input', () => {
  const result = parseGid(undefined);
  assert.equal(result.id, '');
  assert.equal(result.resource, null);
});

test('returns empty defaults for invalid input', () => {
  const result = parseGid('not-a-gid');
  assert.equal(result.id, '');
  assert.equal(result.resource, null);
});

test('preserves query parameters and hash in the ID', () => {
  const result = parseGid('gid://shopify/InventoryLevel/123?inventory_item_id=456#hash');
  assert.equal(result.id, '123?inventory_item_id=456#hash');
  assert.equal(result.resourceId, '123');
  assert.equal(result.searchParams.get('inventory_item_id'), '456');
  assert.equal(result.search, '?inventory_item_id=456');
  assert.equal(result.hash, '#hash');
});

test('returns empty components for missing, invalid, or incomplete GIDs', () => {
  for (const gid of [undefined, '', 'invalid', 'gid://shopify/Market', 'gid://shopify/Market/']) {
    const result = parseGid(gid);
    assert.equal(result.id, '');
    assert.equal(result.resource, null);
    assert.equal(result.resourceId, null);
    assert.equal(result.search, '');
    assert.equal(result.searchParams.size, 0);
    assert.equal(result.hash, '');
  }
});
