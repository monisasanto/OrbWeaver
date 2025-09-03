function success(data) { return { success: true, data }; }
function error(msg) { return { success: false, error: msg }; }
module.exports = { success, error };
