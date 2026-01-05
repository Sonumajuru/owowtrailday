import express from 'express';
import request from 'supertest';
import authRouter from '../routes/auth.routes';
import { HandleLogin, RegisterUser } from '../services/auth.service';
import { GetUserByEmail } from '../services/users.service';

jest.mock('../services/auth.service', () => ({
  RegisterUser: jest.fn(),
  HandleLogin: jest.fn(),
}));
jest.mock('../services/users.service', () => ({
  GetUserByEmail: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/v1', authRouter);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/v1/register', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/register').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Email, password, role, and options are required.',
    });
  });

  it('returns 201 when registration succeeds', async () => {
    (RegisterUser as jest.Mock).mockImplementation((_data, res) => {
      res.status(201).json({ success: true });
    });

    const res = await request(app).post('/api/v1/register').send({
      email: 'test@example.com',
      password: 'Pass123!',
      name: 'Test',
      role: 'User',
      options: 'Developer',
      phoneNumber: '1234567890',
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ success: true });
  });
});

describe('POST /api/v1/login', () => {
  it('returns 400 when email or password is missing', async () => {
    const res = await request(app).post('/api/v1/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: 'Email and password are required.',
    });
  });

  it('returns 404 when user is not found', async () => {
    (GetUserByEmail as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post('/api/v1/login').send({
      email: 'missing@example.com',
      password: 'Pass123!',
    });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found.' });
  });

  it('returns 401 when password is invalid', async () => {
    (GetUserByEmail as jest.Mock).mockResolvedValue({
      UserId: 'user-id',
      Email: 'test@example.com',
      Role: 'User',
      Options: 'Developer',
      PasswordHash: 'hashed',
    });
    (HandleLogin as jest.Mock).mockResolvedValue(null);

    const res = await request(app).post('/api/v1/login').send({
      email: 'test@example.com',
      password: 'WrongPass!',
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid password.' });
  });

  it('returns 200 when login succeeds', async () => {
    (GetUserByEmail as jest.Mock).mockResolvedValue({
      UserId: 'user-id',
      Email: 'test@example.com',
      Role: 'User',
      Options: 'Developer',
      PasswordHash: 'hashed',
    });
    (HandleLogin as jest.Mock).mockResolvedValue('token');

    const res = await request(app).post('/api/v1/login').send({
      email: 'test@example.com',
      password: 'Pass123!',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Login successful' });
  });
});
