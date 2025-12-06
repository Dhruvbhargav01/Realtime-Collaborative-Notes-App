// backend/controllers/noteController.js
const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') return res.status(400).json({ message: 'Title required' });

    const note = new Note({ title: title.trim(), content: '' });
    await note.save();
    return res.status(201).json(note);
  } catch (err) {
    console.error('createNote error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id).lean();
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
  } catch (err) {
    console.error('getNote error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title } = req.body;
    const update = {};
    if (typeof content !== 'undefined') update.content = content;
    if (typeof title !== 'undefined') update.title = title;
    // updatedAt is automatic because timestamps: true and we use findByIdAndUpdate with { new: true }
    const note = await Note.findByIdAndUpdate(id, update, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
  } catch (err) {
    console.error('updateNote error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
