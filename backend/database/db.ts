import mysqlPkg from 'mysql2/promise';
const { createPool } = mysqlPkg;
import type { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();

// Load .env
dotenv.config({ path: path.resolve(__dirname, 'backend/.env') });

// --------------------
// Types
// --------------------
export interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

// --------------------
// Pool
// --------------------
let pool: Pool | null = null;

export function initPool(config?: DbConfig): Pool {
  if (pool) {
    console.log('DB pool already initialized');
    return pool;
  }

  let dbConfig: DbConfig;

  if (config) {
    dbConfig = config;
  } else {
    // Read from environment variables
    dbConfig = {
      host: process.env.DB_HOST || '',
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '',
    };
  }

  pool = createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }) as Pool;

  return pool;
}

export function getPool(): Pool {
  if (!pool) throw new Error('DB pool not initialized');
  return pool;
}
