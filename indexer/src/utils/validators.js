function validateAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}
function validateChainId(id) {
  return Number.isInteger(id) && id > 0;
}
module.exports = { validateAddress, validateChainId };
