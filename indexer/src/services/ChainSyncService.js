class ChainSyncService {
  constructor(provider, chainConfig) {
    this.provider = provider;
    this.chainConfig = chainConfig;
    this.lastSyncedBlock = 0;
  }
  
  async syncBlocks() {
    const latest = await this.provider.getBlockNumber();
    for (let i = this.lastSyncedBlock + 1; i <= latest; i += 100) {
      await this.processBatch(i, Math.min(i + 99, latest));
    }
    this.lastSyncedBlock = latest;
  }
  
  async processBatch(start, end) {
    const logs = await this.provider.getLogs({ fromBlock: start, toBlock: end });
    return logs;
  }
}
module.exports = ChainSyncService;
