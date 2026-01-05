import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { User } from '../modal/index';

export function GenerateAccessToken(user: User, userId?: string): string {
  return jwt.sign(
    {
      userId: user.UserId ?? userId,
      email: user.Email,
      userRoleType: user.Role,
    },
    process.env.TOKEN_KEY!,
    { expiresIn: '4h' }
  );
}

export function ComparePasswords(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, hashedPassword);
}
