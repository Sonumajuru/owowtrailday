import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';

import type { UserDTO } from '../modal/index';
import { AppError } from '../middleware/error.js';
import {
  GetAllUsers,
  GetUserById,
  UpdateUser,
  DeleteUser,
} from '../services/users.service';

const router = Router();

// GET ALL USERS
router.get(
  '/',
  async (_req: Request, res: Response<UserDTO[]>, next: NextFunction) => {
    try {
      const users = await GetAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
);

// GET USER BY ID
router.get(
  '/:userId',
  async (
    req: Request,
    res: Response<UserDTO | { error: string }>,
    next: NextFunction
  ) => {
    try {
      const user = await GetUserById(req.params.userId);
      if (!user) throw new AppError('User not found', 404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE USER
router.put(
  '/:userId',
  async (
    req: Request<{ userId: string }, unknown, UserDTO>,
    res: Response<{ success: true }>,
    next: NextFunction
  ) => {
    try {
      await UpdateUser(req.params.userId, req.body);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE USER
router.delete(
  '/:userId',
  async (
    req: Request,
    res: Response<{ success: true }>,
    next: NextFunction
  ) => {
    try {
      await DeleteUser(req.params.userId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
