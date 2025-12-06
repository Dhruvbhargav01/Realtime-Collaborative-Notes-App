// backend/models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
}, {
  timestamps: true // adds createdAt & updatedAt
});

module.exports = mongoose.model('Note', NoteSchema);
