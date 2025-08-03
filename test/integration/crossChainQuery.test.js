const { expect } = require('chai');

describe('Cross-Chain Query', function() {
  it('should query multiple chains', async function() {
    const result = await queryCrossChain('0x123', [1, 137]);
    expect(result.chains).to.have.lengthOf(2);
  });
});
