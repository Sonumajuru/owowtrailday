import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';

import type { User } from '../modal/index';
import type { UserOptions, UserRole } from '../modal/model';
import { GetUserByEmail } from '../services/users.service';
import { HandleLogin, RegisterUser } from '../services/auth.service';

const router = Router();

// REGISTER
router.post(
  `/register`,
  async (
    req: Request<
      object,
      object,
      {
        email: string;
        password: string;
        name?: string | null;
        role: UserRole;
        options: UserOptions;
        phoneNumber?: string | null;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password, name, role, options, phoneNumber } = req.body;

    if (!email || !password || !role || !options) {
      return res.status(400).json({
        message: 'Email, password, role, and options are required.',
      });
    }

    const registerData: User = {
      UserId: '',
      Name: name ?? null,
      Role: role,
      Options: options,
      Email: email,
      PasswordHash: password,
      PhoneNumber: phoneNumber ?? null,
    };

    try {
      await RegisterUser(registerData, res);
    } catch (error) {
      next(error);
    }
  }
);

// LOGIN
router.post(
  '/login',
  async (
    req: Request<object, object, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required.' });
      }

      const user: User | null = await GetUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const accessToken = await HandleLogin(password, user);

      if (!accessToken) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.status(200).json({
        message: 'Login successful',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
