// backend/config/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB(mongoUri) {
  if (!mongoUri) throw new Error('MONGO_URI not set');
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
