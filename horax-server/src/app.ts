import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoute from './routes/cartRoutes';
import profileRoute from './routes/profileRoutes';
import addressRoutes from './routes/addressRoutes';
import orderRoutes from './routes/orderRoutes';

dotenv.config();
const app: Application = express();

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', '*.cloudinary.com'],
        connectSrc: ["'self'", 'https://api.cloudinary.com'],
        // Add other directives as needed
      },
    },
  })
);

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Define allowed origins
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL || 'http://localhost:5173', // Default to local if not set
  'https://horax.com', // Production frontend
  'https://horax.netlify.app',
];

// CORS options
const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Rate limiters for sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  message: { message: 'Too many requests, please try again later' },
});

// Apply rate limiting to sensitive routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/verify-otp', authLimiter);

// Connect to MongoDB
connectDB();

// API health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Horax API is running' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/addresses', addressRoutes);
app.use('/api/profile', profileRoute);

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message.includes('CORS')) {
    console.error('CORS error:', err.message);
    return res
      .status(403)
      .json({ message: 'CORS error: Access not allowed from this origin' });
  }
  console.error('Unexpected error:', err.message);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Handle 404 routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Horax server running on port ${PORT}`);
});

export default app;
