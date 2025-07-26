class Block {
  constructor(data) {
    this.chainId = data.chainId;
    this.blockNumber = data.blockNumber;
    this.blockHash = data.blockHash;
    this.timestamp = data.timestamp;
  }
  toJSON() { return { ...this }; }
  static fromRaw(raw, chainId) {
    return new Block({ chainId, blockNumber: raw.number, blockHash: raw.hash, timestamp: raw.timestamp });
  }
}
module.exports = Block;
