const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { queryDemo } = require('../src/api/demo');
const apps = require('../src/data/demo-apps.json');

test('pagination, sorting, and filters use the local catalog', () => {
  const first = queryDemo({ url: 'dapp', params: { page: 1, limit: 10 } }).data;
  const second = queryDemo({ url: 'dapp', params: { page: 2, limit: 10 } }).data;
  assert.equal(first.response.length, 10);
  assert.equal(second.response.length, apps.length - 10);
  assert.equal(first.pageCount, 2);
  const names = [...first.response, ...second.response].map((app) => app.name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  assert.equal(new Set([...first.response, ...second.response].map((app) => app.dappId)).size, apps.length);
  assert.equal(queryDemo({ url: 'dapp', params: { search: 'ATLAS' } }).data.response[0].dappId, 'atlas-wallet');
  assert.equal(queryDemo({ url: 'dapp', params: { search: 'no-such-listing' } }).data.response.length, 0);
  assert.equal(queryDemo({ url: 'dapp', params: { categories: ['utilities'], subCategory: ['wallets'] } }).data.response.length, 2);
  assert.equal(queryDemo('dapp?search=atlas+wallet').data.response.length, 1);
});

test('featured and detail lookups resolve to known local apps', () => {
  const ids = queryDemo('store/featured').data[0].dappIds;
  assert.equal(ids.length, 6);
  assert.equal(queryDemo('dapp/search/' + ids.join(',')).data.data.length, 6);
  assert.equal(queryDemo('dapp/search/atlas-wallet').data.data[0].name, 'Atlas Wallet');
  assert.deepEqual(queryDemo('dapp/search/unknown-id').data.data, []);
  assert.equal(queryDemo('dapp/rate/atlas-wallet').data.data.length, 0);
});

test('all artwork is bundled and submissions are rejected', () => {
  apps.forEach((app) => {
    [app.images.banner, app.images.logo, ...app.images.screenshots].forEach((asset) => {
      assert.ok(asset.startsWith('/assets/'));
      assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', asset)));
    });
  });
  assert.equal(queryDemo({ url: 'dapp/rate', method: 'POST', body: { rating: 5 } }).error.status, 403);
  assert.equal(queryDemo({ url: 'postuser', method: 'POST', body: {} }).error.status, 403);
  assert.equal(queryDemo('unknown-endpoint').error.status, 404);
});

test('chain filters include only the selected chain and support All Chains', () => {
  for (const chainId of [1, 137, 1101]) {
    const result = queryDemo({ url: 'dapp', params: { chainId, limit: 100 } }).data;
    assert.ok(result.response.length > 0);
    assert.ok(result.response.every(app => app.chains.includes(chainId)));
    assert.equal(result.total, apps.filter(app => app.chains.includes(chainId)).length);
  }
  assert.equal(queryDemo({ url: 'dapp', params: { chainId: null, limit: 100 } }).data.response.length, apps.length);
  assert.equal(queryDemo({ url: 'dapp', params: { chainId: 99999 } }).data.response.length, 0);
});
