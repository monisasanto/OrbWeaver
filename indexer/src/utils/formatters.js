/**
 * Data formatting utilities for blockchain data
 */

function formatAddress(address) {
  if (!address) return '';
  return address.toLowerCase();
}

function formatChecksum(address) {
  // Simple checksum formatting (real implementation would use proper EIP-55)
  if (!address || !address.startsWith('0x')) return address;
  return address.slice(0, 2) + address.slice(2).toLowerCase();
}

function formatBlockNumber(blockNumber) {
  return parseInt(blockNumber, 10);
}

function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toISOString();
}

function formatEther(wei) {
  if (!wei) return '0';
  return (BigInt(wei) / BigInt(1e18)).toString();
}

function formatGwei(wei) {
  if (!wei) return '0';
  return (BigInt(wei) / BigInt(1e9)).toString();
}

function formatWei(ether) {
  if (!ether) return '0';
  return (BigInt(Math.floor(parseFloat(ether) * 1e18))).toString();
}

function formatHash(hash) {
  if (!hash) return '';
  return hash.toLowerCase();
}

function formatCompact(number) {
  const num = parseFloat(number);
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
}

function truncateAddress(address, startChars = 6, endChars = 4) {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

module.exports = {
  formatAddress,
  formatChecksum,
  formatBlockNumber,
  formatTimestamp,
  formatEther,
  formatGwei,
  formatWei,
  formatHash,
  formatCompact,
  truncateAddress
};
