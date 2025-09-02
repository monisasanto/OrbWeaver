const { expect } = require('chai');
const { validateAddress } = require('../../indexer/src/utils/validators');

describe('Validators', () => {
  it('validates addresses', () => {
    expect(validateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).to.be.true;
  });
});
