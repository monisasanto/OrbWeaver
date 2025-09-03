function now() { return Date.now(); }
function toISO(ts) { return new Date(ts).toISOString(); }
module.exports = { now, toISO };
