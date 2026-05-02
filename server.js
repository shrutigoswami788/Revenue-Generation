require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const propRoutes = require('./routes/propRoutes');
const otpRoutes = require('./routes/otpRoutes');
const errorHandler = require('./middleware/error');
const sendEmail = require('./utils/sendEmail');

// New Middleware Imports
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true // allow cookies
})); 
app.use(express.json({ limit: '50mb' })); // Parse incoming JSON requests (increased limit for base64 images)
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(compression()); // Compress responses for better performance

// Rate Limiting for Global API
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use('/api', limiter);

// API Routes
app.use('/api', contactRoutes);
app.use('/api', otpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Health Check Route
app.get('/', (req, res) => {
    res.send('API is running securely...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
