const { expect } = require('chai');
const Cache = require('../../gateway/src/utils/cache');

describe('Cache', () => {
  it('stores and retrieves', () => {
    const c = new Cache();
    c.set('key', 'val');
    expect(c.get('key')).to.equal('val');
  });
});
