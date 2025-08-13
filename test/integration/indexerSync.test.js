const { expect } = require('chai');

describe('Indexer Sync', function() {
  it('should sync blocks correctly', async function() {
    const syncer = new ChainSyncer(config);
    await syncer.initialize();
    const result = await syncer.syncAll();
    expect(result.synced).to.be.true;
  });
});
