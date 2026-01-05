import type { Pool, PoolConnection } from 'mysql2/promise';
import { getPool } from '../database/db';

/**
 * Acquires a connection, runs the callback, and releases the connection.
 */
export async function withConnection<T>(
  callback: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const pool: Pool = getPool();
  const connection = await pool.getConnection();
  try {
    return await callback(connection);
  } finally {
    connection.release(); // always release even if callback throws
  }
}
