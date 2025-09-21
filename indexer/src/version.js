/**
 * Version information for OrbWeaver Indexer
 */

const version = '0.1.0';
const buildDate = '2025-09-21';
const codename = 'Genesis';
const gitCommit = process.env.GIT_COMMIT || 'unknown';

function getVersionInfo() {
  return {
    version,
    buildDate,
    codename,
    gitCommit,
    fullVersion: `OrbWeaver Indexer ${version} (${codename})`,
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch
  };
}

function printVersion() {
  const info = getVersionInfo();
  console.log(`${info.fullVersion}`);
  console.log(`Build: ${info.buildDate}`);
  console.log(`Git Commit: ${info.gitCommit}`);
  console.log(`Node: ${info.nodeVersion}`);
  return info;
}

function isCompatible(requiredVersion) {
  const [reqMajor, reqMinor] = requiredVersion.split('.').map(Number);
  const [curMajor, curMinor] = version.split('.').map(Number);
  
  if (curMajor !== reqMajor) return false;
  return curMinor >= reqMinor;
}

module.exports = {
  version,
  buildDate,
  codename,
  gitCommit,
  getVersionInfo,
  printVersion,
  isCompatible
};
