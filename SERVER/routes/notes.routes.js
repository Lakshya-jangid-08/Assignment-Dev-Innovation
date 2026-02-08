const express = require('express');
const { getNotes, getNodeById, createNote, updateNotes, deleteNotes } = require('../controller/notes.controller.js');
const { protect } = require('../middleware/authMiddleware.js');
const noteRoutes = express.Router();

noteRoutes.get('/', protect, getNotes);

noteRoutes.get('/:id', protect, getNodeById);

noteRoutes.post('/', protect, createNote);

noteRoutes.put('/:id', protect, updateNotes);

noteRoutes.delete('/:id', protect, deleteNotes);

module.exports = noteRoutes;