// backend/server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const registerNoteSocket = require('./socket/noteSocket');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// ✅ CORS configuration for REST API
const allowedOrigins = [
  "http://localhost:5173",
  "https://realtime-collaborative-notes-app-frontend.onrender.com",
  "http://realtime-collaborative-notes-app-frontend.onrender.com" // safety for Render
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200 // handles preflight requests
}));

// Routes
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

// Server setup
const PORT = process.env.PORT || 4000;

async function start() {
  // Connect to MongoDB
  await connectDB(process.env.MONGO_URI);

  // Create HTTP server
  const httpServer = createServer(app);

  // ✅ Socket.IO with CORS
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  // Register socket events
  registerNoteSocket(io);

  // Start server
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start server with error handling
start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
