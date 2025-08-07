function formatAddress(addr) { return addr?.toLowerCase() || ''; }
function formatTimestamp(ts) { return new Date(ts * 1000).toISOString(); }
function formatEther(wei) { return (BigInt(wei) / BigInt(1e18)).toString(); }
module.exports = { formatAddress, formatTimestamp, formatEther };
