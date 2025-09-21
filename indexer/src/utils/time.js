/**
 * Time and date utilities
 */

function now() {
  return Date.now();
}

function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

function toISO(timestamp) {
  return new Date(timestamp).toISOString();
}

function fromISO(isoString) {
  return new Date(isoString).getTime();
}

function toUnixTimestamp(date) {
  return Math.floor(new Date(date).getTime() / 1000);
}

function fromUnixTimestamp(timestamp) {
  return new Date(timestamp * 1000);
}

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function isExpired(timestamp, ttl) {
  return Date.now() > timestamp + ttl;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  now,
  nowInSeconds,
  toISO,
  fromISO,
  toUnixTimestamp,
  fromUnixTimestamp,
  formatDuration,
  isExpired,
  sleep
};
