const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Configure environment variables (support .env.local or standard .env)
const localEnvPath = path.join(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else {
  dotenv.config();
}

// Connect to Database
const Client = require('./models/Client');
const seedClients = async () => {
  try {
    const count = await Client.countDocuments();
    if (count === 0) {
      console.log('Seeding initial clients...');
      const initialClients = [
        "PVR GROUP",
        "HOTEL - CRAB",
        "ROYAL ICON",
        "PVR CLASSIC",
        "CORNER STONE",
        "ROYAL RIGHTWAY",
        "CITY ELITE",
        "BHAVISHYA HILLS",
        "SLV",
        "URBAN MEADOWS",
        "SKY TOWERS",
        "ANANDALAHARI",
        "PRIDE"
      ];
      const docs = initialClients.map((name, index) => ({
        name,
        order: index,
        active: true
      }));
      await Client.insertMany(docs);
      console.log('Initial clients seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding clients:', err.message);
  }
};
connectDB().then(seedClients);

// Ensure upload directories exist
fs.mkdirSync(path.join(__dirname, 'uploads', 'thumbnails'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'uploads', 'videos'), { recursive: true });

const app = express();

// Security and Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading media from local static uploads
}));
app.use(limiter);

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
    message: "Backend running successfully",
    data: null
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "Health OK",
    data: { status: "ok" }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "API Health OK",
    data: { status: "ok" }
  });
});

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
