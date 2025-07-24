class Event {
  constructor(data) {
    this.chainId = data.chainId;
    this.blockNumber = data.blockNumber;
    this.transactionHash = data.transactionHash;
    this.address = data.address;
    this.topics = data.topics;
    this.data = data.data;
  }
  toJSON() { return { ...this }; }
}
module.exports = Event;
