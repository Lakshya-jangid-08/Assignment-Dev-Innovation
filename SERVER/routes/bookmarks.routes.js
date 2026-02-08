// Bookmarks API:
// POST    /api/bookmarks
// GET     /api/bookmarks?q=searchTerm&tags=tag1,tag2
// GET     /api/bookmarks/:id
// PUT     /api/bookmarks/:id
// DELETE  /api/bookmarks/:id

const express = require('express');
const bookmarkRoutes = express.Router();
const { getBookmarks, getBookmarkById, createBookmark, updateBookmark, deleteBookmark } = require('../controller/bookmarks.controller.js');
const { protect } = require('../middleware/authMiddleware.js');

bookmarkRoutes.get('/', protect, getBookmarks);

bookmarkRoutes.get('/:id', protect, getBookmarkById);

bookmarkRoutes.post('/', protect, createBookmark);

bookmarkRoutes.put('/:id', protect, updateBookmark);

bookmarkRoutes.delete('/:id', protect, deleteBookmark);

module.exports = bookmarkRoutes;