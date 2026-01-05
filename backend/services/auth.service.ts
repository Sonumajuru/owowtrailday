import type { Response } from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import type { User } from '../modal/index';
import { withConnection, withRetry } from '../middleware/dbHelpers';
import { ComparePasswords, GenerateAccessToken } from '../utils/helper';

export async function RegisterUser(regData: User, res: Response) {
  try {
    const salt = await bcrypt.genSalt(10);
    if (!regData.PasswordHash) {
      return null;
    }
    const hash = await bcrypt.hash(regData.PasswordHash, salt);

    const userId = await InsertUserAndGenerateToken(regData, hash, salt);

    const accessToken = GenerateAccessToken(regData, userId);

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.status(201).json({
      success: true,
      message: 'Successfully registered',
      accessToken: accessToken,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({ error });
  }
}

export async function HandleLogin(
  password: string,
  user: User
): Promise<string | null> {
  if (!user.PasswordHash) {
    return null;
  }

  const passwordMatch = await ComparePasswords(password, user.PasswordHash);

  if (!passwordMatch) {
    return null;
  }

  const accessToken = GenerateAccessToken(user);

  return accessToken;
}

export async function InsertUserAndGenerateToken(
  regData: User,
  hash: string,
  salt: string
): Promise<string> {
  return withConnection(async (conn) => {
    // Check if user already exists (including soft-deleted)
    const [existingUsers] = await withRetry(() =>
      conn.query<RowDataPacket[]>(
        'SELECT UserID, IsDeleted FROM Users WHERE Email = ?',
        [regData.Email]
      )
    );

    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    const values = [
      regData.Name,
      regData.Role,
      regData.Options,
      regData.Email,
      regData.PhoneNumber ?? null,
      hash,
      salt,
    ];

    const [result] = await withRetry(() =>
      conn.query<ResultSetHeader>(
        `
        INSERT INTO Users
        (Name, Role, Options, Email, PhoneNumber, PasswordHash, PasswordSalt)
        VALUES (?)
        `,
        [values]
      )
    );

    if (!result.insertId) {
      throw new Error('User insertion failed');
    }

    const [rows] = await withRetry(() =>
      conn.query<RowDataPacket[]>('SELECT UserID FROM Users WHERE Email = ?', [
        regData.Email,
      ])
    );

    if (!rows.length) {
      throw new Error('User insertion failed');
    }

    return rows[0].UserID as string;
  });
}
