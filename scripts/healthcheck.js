const axios = require('axios');

async function check() {
  try {
    await axios.get('http://localhost:4000/health');
    console.log('✓ Indexer healthy');
  } catch (e) { console.error('✗ Indexer down'); }
}
check();
