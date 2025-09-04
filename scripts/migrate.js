const { Pool } = require('pg');
const fs = require('fs');

async function migrate() {
  const pool = new Pool({ database: process.env.DATABASE_NAME });
  await pool.query(fs.readFileSync('./indexer/src/db/schema.sql', 'utf8'));
  await pool.end();
  console.log('Migration done');
}
migrate();
