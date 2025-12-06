// backend/socket/noteSocket.js
const Note = require('../models/Note');

/**
 * io: Socket.IO server instance
 *
 * Events handled:
 *  - join_note: { noteId, username? }
 *  - leave_note: { noteId }
 *  - note_update: { noteId, content }  (from client)
 *  - request_note: { noteId } -> server sends note_data
 *
 * Emits:
 *  - note_update: { noteId, content, updatedAt, senderId? }
 *  - note_data: { note } (full note)
 *  - active_users: { noteId, count, users: [ { socketId, name } ] }
 */
module.exports = function registerNoteSocket(io) {
  // room -> Map(socketId => username)
  const roomUsers = new Map();

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join_note', async (payload) => {
      const { noteId, username } = (typeof payload === 'object' ? payload : { noteId: payload });
      if (!noteId) {
        socket.emit('error', { message: 'noteId required to join' });
        return;
      }

      socket.join(noteId);

      if (!roomUsers.has(noteId)) roomUsers.set(noteId, new Map());
      const usersMap = roomUsers.get(noteId);
      usersMap.set(socket.id, username || `User-${socket.id.slice(0,6)}`);

      // send active users to room
      emitActiveUsers(noteId);

      // send latest full note to this client
      try {
        const note = await Note.findById(noteId).lean();
        if (note) {
          socket.emit('note_data', { note });
        } else {
          socket.emit('note_not_found', { noteId });
        }
      } catch (err) {
        console.error('join_note error fetching note', err);
      }
    });

    socket.on('leave_note', (payload) => {
      const { noteId } = (typeof payload === 'object' ? payload : { noteId: payload });
      if (!noteId) return;
      socket.leave(noteId);
      if (roomUsers.has(noteId)) {
        roomUsers.get(noteId).delete(socket.id);
        emitActiveUsers(noteId);
      }
    });

    socket.on('note_update', async (payload) => {
      const { noteId, content } = payload || {};
      if (!noteId) return;

      const updatedAt = new Date().toISOString();

      // Broadcast to other participants in room
      socket.to(noteId).emit('note_update', { noteId, content, updatedAt, senderId: socket.id });

      // Persist (best-effort). We don't await before broadcasting to keep low latency.
      try {
        await Note.findByIdAndUpdate(noteId, { content, updatedAt: new Date() }, { new: true });
      } catch (err) {
        console.error('note_update DB save error', err);
      }
    });

    socket.on('request_note', async (payload) => {
      const { noteId } = payload || {};
      if (!noteId) return;
      try {
        const note = await Note.findById(noteId).lean();
        if (note) socket.emit('note_data', { note });
        else socket.emit('note_not_found', { noteId });
      } catch (err) {
        console.error('request_note error', err);
      }
    });

    socket.on('disconnecting', () => {
      // socket.rooms is a Set including socket.id and joined rooms
      const rooms = Array.from(socket.rooms);
      rooms.forEach((roomId) => {
        // skip the socket own room (socket.id)
        if (roomId === socket.id) return;
        if (roomUsers.has(roomId)) {
          roomUsers.get(roomId).delete(socket.id);
          emitActiveUsers(roomId);
        }
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });

    function emitActiveUsers(noteId) {
      const usersMap = roomUsers.get(noteId) || new Map();
      const users = Array.from(usersMap.entries()).map(([socketId, name]) => ({ socketId, name }));
      const payload = { noteId, count: users.length, users };
      io.to(noteId).emit('active_users', payload);
    }
  });
};
