class BlockProcessor {
  constructor(provider, chainConfig) {
    this.provider = provider;
    this.chainConfig = chainConfig;
    this.currentBlock = chainConfig.startBlock;
  }

  async getBlock(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber);
      if (!block) {
        throw new Error(`Block ${blockNumber} not found`);
      }

      return {
        chainId: this.chainConfig.chainId,
        chainName: this.chainConfig.name,
        blockNumber: block.number,
        blockHash: block.hash,
        timestamp: block.timestamp,
        transactions: block.transactions.length,
        gasUsed: block.gasUsed.toString(),
        gasLimit: block.gasLimit.toString()
      };
    } catch (error) {
      console.error(`Error processing block ${blockNumber}:`, error);
      throw error;
    }
  }

  async getLatestBlock() {
    const blockNumber = await this.provider.getBlockNumber();
    return this.getBlock(blockNumber);
  }

  async processBlockRange(startBlock, endBlock) {
    const results = [];

    for (let i = startBlock; i <= endBlock; i++) {
      try {
        const blockData = await this.getBlock(i);
        results.push(blockData);
      } catch (error) {
        console.error(`Failed to process block ${i}:`, error);
      }
    }

    return results;
  }

  async waitForConfirmations(blockNumber) {
    const currentBlock = await this.provider.getBlockNumber();
    const confirmations = currentBlock - blockNumber;

    return confirmations >= this.chainConfig.confirmations;
  }
}

module.exports = BlockProcessor;

