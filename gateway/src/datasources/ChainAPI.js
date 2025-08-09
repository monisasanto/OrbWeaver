class ChainAPI {
  constructor(baseUrl) { this.baseUrl = baseUrl; }
  async getChain(chainId) {
    const res = await fetch(\`\${this.baseUrl}/chains/\${chainId}\`);
    return await res.json();
  }
  async getAllChains() {
    const res = await fetch(\`\${this.baseUrl}/chains\`);
    return await res.json();
  }
}
module.exports = ChainAPI;
