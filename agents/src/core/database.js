require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const dbUrl = process.env.DATABASE_URL;
const useSSL = dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('railway.internal');

const pool = new Pool({
  connectionString: dbUrl,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
});

const q = (text, params) => pool.query(text, params);

async function runMigrations() {
  const migrationDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
    await pool.query(sql);
    console.log(`Migration applied: ${file}`);
  }
}

async function testConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected.');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    return false;
  }
}

module.exports = { pool, q, runMigrations, testConnection };
