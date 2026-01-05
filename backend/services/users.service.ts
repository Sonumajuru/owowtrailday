import type { RowDataPacket } from 'mysql2/promise';
import type { UserDTO } from '../modal/index';
import { withConnection, withRetry } from '../middleware/dbHelpers';

export async function GetAllUsers(): Promise<UserDTO[]> {
  return withConnection(async (conn) => {
    const [rows] = await withRetry(() =>
      conn.query<RowDataPacket[]>(`SELECT * FROM Users WHERE IsDeleted = FALSE`)
    );
    return rows as UserDTO[];
  });
}

export async function GetUserById(userId: string): Promise<UserDTO | null> {
  return withConnection(async (conn) => {
    const [rows] = await withRetry(() =>
      conn.query<RowDataPacket[]>(
        `SELECT * FROM Users WHERE UserID = ? AND IsDeleted = FALSE`,
        [userId]
      )
    );
    return (rows as UserDTO[])[0] || null;
  });
}

export async function GetUserByEmail(email: string): Promise<UserDTO | null> {
  return withConnection(async (conn) => {
    const [rows] = await withRetry(() =>
      conn.query<RowDataPacket[]>(
        `SELECT * FROM Users WHERE Email = ? AND IsDeleted = FALSE`,
        [email]
      )
    );
    return (rows as UserDTO[])[0] || null;
  });
}

export async function UpdateUser(userId: string, data: UserDTO): Promise<void> {
  return withConnection(async (conn) => {
    await withRetry(() =>
      conn.query(`UPDATE Users SET ? WHERE UserID = ?`, [data, userId])
    );
  });
}

export async function DeleteUser(userId: string): Promise<void> {
  return withConnection(async (conn) => {
    await withRetry(() =>
      conn.query(`UPDATE Users SET IsDeleted = TRUE WHERE UserID = ?`, [userId])
    );
  });
}
