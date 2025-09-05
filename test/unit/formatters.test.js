const { expect } = require('chai');
const { formatAddress } = require('../../indexer/src/utils/formatters');

describe('Formatters', () => {
  it('formats addresses', () => expect(formatAddress('0xABC')).to.equal('0xabc'));
});
