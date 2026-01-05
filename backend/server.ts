import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middleware/error';
import bodyParser from 'body-parser';
import { getPool, initPool } from './database/db';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';

const app = express();
const PORT: number = Number(process.env.PORT) || 3001;
const API_URL = process.env.API_URL || '/api/v1';

// CORS options configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const corsOptions: Record<string, any> = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Initialize DB Pool at startup
initPool();

// Middleware setup
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.enable('trust proxy');

// Redirect HTTP to HTTPS except for local/debug environments
app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// HEALTH ENDPOINTS
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/health/db', async (_req: Request, res: Response) => {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

// API ENDPOINTS
app.use(API_URL, authRouter);
app.use(API_URL, usersRouter);

// Global error handler LAST
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, async () => {
  // Delay the initial health check slightly to allow pool to settle
  setTimeout(async () => {}, 50);
  console.log(`Server is running on port ${PORT}`);
});
