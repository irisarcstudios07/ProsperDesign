const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

// Configure environment variables (support .env.local or standard .env)
const localEnvPath = path.join(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else {
  dotenv.config();
}

// Connect to Database
connectDB();

// Ensure upload directories exist
fs.mkdirSync(path.join(__dirname, 'uploads', 'thumbnails'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'uploads', 'videos'), { recursive: true });

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading media from local static uploads
}));

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      "http://localhost:5173",
      "https://prosper-design.vercel.app"
    ];

    if (!origin) return callback(null, true);

    if (
      allowed.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan('dev'));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & Info Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully"
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: "ok"
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: "ok"
  });
});

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
